import path from 'path';

const folders = {
	data: path.join(process.cwd(), 'data')
};

const files = {
	pricelist: path.join(folders.data, '/pricelist.json'),
	schema: path.join(folders.data, '/schema.json'),
	polldata: path.join(folders.data, '/polldata.json'),
	package: '../package.json'
};

export = {
	folders,
	files
};
