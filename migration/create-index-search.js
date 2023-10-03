let db = db.getSiblingDB('customerDb');

printjson('Gerando indice.');

db.customers.createIndex({ '$**': 'text' });

printjson('Gerado índice com sucesso');
