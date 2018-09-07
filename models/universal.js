"use strict";

let mysql = require('mysql');

let pool = null;

let query = (qry, callback) => {
	
	let condition;
	let stringquery = qry;
	
	if(qry.condition){
		condition = qry.condition
		stringquery = qry.query;
	}

	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected!
	
		connection.query(stringquery,condition, (err, rows, fields) => callback(err, rows) );	
	});

}

module.exports = class db {
	
	constructor (connectionLimit = 10, host = 'localhost', user = 'admin', password = 'admin', database = 'default') {

		pool = mysql.createPool({
			connectionLimit : connectionLimit,
			host     : host,
			user     : user,
			password : password,
			database : database
		});

		/* insert */ 
		this.create = (table, condition, callback) => {

			let querystring={'query':`INSERT INTO ${table} SET ?`,'condition':condition};
			
			query(querystring, (err, data) => callback(err, data) );
		}

		/* select */
		this.read = (table, columns, condition, from, limit, ordercolum, order, callback) => {

			let where = '';
			for (key in condition) {
				where += !where ? ` ${key} LIKE "${condition[key]}"` : ` AND ${key} LIKE "${condition[key]}"`;
			}
			
			if (!limit) {
				limit = '';
			}
			if (!from) {
				from = '';
			}
			if (!ordercolum) {
				ordercolum = '';
			}	else {
				ordercolum = `ORDER BY ${ordercolum}`;
			}
			if (!order) {
				order = '';
			}
			
			let querystring = where !== '' ? `SELECT ${columns} FROM ${table} WHERE ${where} ${limit} ${from} ${ordercolum} ${order}` : `SELECT ${columns} FROM ${table} ${limit} ${from} ${ordercolum} ${order}`;
			
			query(querystring, (err, data) => callback(err, data) );
		}

		/* update */
		this.update = (table, updateset, condition ,callback) => {

			let where = '';
			for (key in condition) {
				where += !where ? ` WHERE ${key} = "${condition[key]}"` : ` AND ${key} = "${condition[key]}"`;
			}

			let setti = '';
			for (key in updateset) {
				setti += !setti ? ` ${key} = "${updateset[key]}"` : `, ${key} = "${updateset[key]}"`
			}

			let querystring = `UPDATE ${table} SET ${setti}  ${where}`;
			query({'query':querystring,'condition':[updateset]}, (err, data) => callback(err, data) );
		}

		/* delete */
		this.delete = (table, condition, callback) => {
			let where = '';
			for (key in condition) {
				where += !where ? ` WHERE ${key} = "${condition[key]}"` : ` AND ${key} = "${condition[key]}"`;
			}

			query(`DELETE FROM ${table} ${where}`, (err, data) => callback(err, data) );
		}
	}

};
