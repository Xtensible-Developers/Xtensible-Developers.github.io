const BSON = require('bson');
const fs = require('fs');
const uuid = require('uuid');
const Long = BSON.Long;
const uuidv4 = uuid.v4;

/// Serialize a document
class DirStoreDocument {
	constructor({uname, password, avatarUrl, is_active}) {
		this._id = uuidv4();
		this.uname = uname;
		this.password = password;
		this.avatarUrl = avatarUrl;
		this.is_active = is_active;
	}
}

var dirstoreDoc = new DirStoreDocument({uname: 'ankur', password: 'hackgodrs', avatarUrl: 'https://', is_active: true});

const data = BSON.serialize(dirstoreDoc);
console.log('\ndata:', data, '\n');

const data_dir = "./data";

fs.access(data_dir, (err) => {
	if (err) {
		fs.mkdir(data_dir, (err) => {
			if (err) { console.log(error); }
			else { console.log("New Directory created successfully !!\n"); }
		});
	} else {
		console.log("Given Directory already exists !!\n");
	}
})

const filename = "./data/" + uuidv4() + ".dirdat";

fs.writeFile(filename, data, (err) => {
	if (err) { return console.error(err); }
	console.log("Finished writing : " + filename + '\n');

	// Read it and de-serialize it.
	fs.readFile(filename, (err) => {
		if (err) { return console.error(err); }
		const doc_2 = BSON.deserialize(data);
		console.log('doc_deserialized:', doc_2, '\n');
	});
});