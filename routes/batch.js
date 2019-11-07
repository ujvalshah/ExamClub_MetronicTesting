const express = require("express");
const router = express.Router();
const FormData = require('form-data');
const fs = require('fs');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const Download = require("../models/download.js");
const Videos = require("../models/download.js");
const Batchupload = require("../models/batchupload.js");
const User = require("../models/user.js");
const Temp = require("../models/temp.js");
const multer = require('multer');
const path = require("path");
var request = require('request');
const middleware = require("../middleware");
const XLSX = require('xlsx');
const { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin, searchAndFilterDocs, sendUploadToGCS, publicURL, uploadFile, deleteTempFile } = middleware;
const projectId = process.env.GCLOUD_STORAGE_BUCKET;
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const gc = new Storage({ projectId, keyFile });

const batchstorage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads/batch')
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname);
	}
});

const upload = multer({ storage: batchstorage });

const bucketName = process.env.GOOGLE_CLOUD_BUCKET;
const bucket = gc.bucket(bucketName);





//----------------------------------------------------------------------------//
//----------------------------------Batch Uploads-----------------------------//
//----------------------------------------------------------------------------//
router.get('/batchupload', isLoggedIn, isAdmin, async function (req, res) {
	let pastBatchUploadFiles = await Batchupload.find({});
	if (!pastBatchUploadFiles) { console.log(err); }
	console.log('pastBatchUploadFiles');
	console.log(pastBatchUploadFiles);
	res.render('index2', { page: 'batchupload', title: 'Batch Upload', batchfiles: pastBatchUploadFiles })
});

router.post('/batchupload', isLoggedIn, isAdmin, upload.fields([{ name: 'batchfile', maxCount: 1 },{ name: 'documents'}]), async function (req, res) {
	console.log('req.body');
	console.log(req.body);
	console.log('req.files');
	console.log(req.files);
	console.log('req.files.documents[0].filename');
	console.log(req.files.documents[0].filename);
	`console.log(req.files.documents[0].filename.slice(indexOf('-')));`
	console.log(req.files.documents[0].filename.slice(req.files.documents[0].filename.indexOf('-')));
	console.log(req.files.documents[0].filename.slice(req.files.documents[0].filename.indexOf('-')+1));
	console.log('done');
	try {
		
		let batch = {};
		batch.name = req.body.name;
		batch.url = req.files.batchfile[0].path;
		batch.saveid = req.files.batchfile[0].filename;
		let newBatchFile = await Batchupload.create(batch);
		console.log('newBatchFilenewBatchFilenewBatchFile');
		console.log(newBatchFile);
		function uploadExcel() {
			var workbook = XLSX.readFile(`uploads/batch/${req.files.batchfile[0].filename}`);
			var sheet_name_list = workbook.SheetNames;
			console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
			var uploadData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
			console.log('uploadData');
			console.log(uploadData);
			return uploadData;
		}
		let uploadData = uploadExcel();

		console.log('uploadDatauploadDatauploadData');
		console.log(uploadData);

		for (const data of uploadData) {
			let download = {};
			download.author = {};
			download.file = [];
			download.exam = [];
			download.attempt = [];
			download.subject = [];

			console.log('download');
			console.log(download);
			download.author.id = req.user._id;
			download.author.username = data.author;
			download.author.displayName = data.author;
			download.exam = data.exam;
			download.attempt = data.attempt;
			download.subject = data.subject;
			download.description = data.description;
			download.title = data.title;
			var newfileName = `${data.filename}_${Date.now()}${data.mime}`;
			var bucketName = process.env.GOOGLE_CLOUD_BUCKET;
			var pathName = path.join('uploads', 'batch', `${data.filename}${data.mime}`);
			console.log('pathNamepathNamepathNamepathName');
			console.log(pathName);


			await uploadFile(bucketName, pathName, newfileName);

			var publicUrl = format(
				`https://storage.googleapis.com/${bucketName}/${newfileName}`
			);
			download.file.push({
				url: publicUrl,
				public_id: newfileName
			});
			console.log('Final download');
			console.log(download);

			var newDownload = await Download.create(download);
			console.log('newDownload');
			console.log(newDownload);
			var documentOwner = await User.findById(req.user._id);
			console.log('documentOwner');
			console.log(documentOwner);
			if (!documentOwner) {
				req.flash("error");
				res.redirect("/downloads/new");
			} else if (documentOwner) {
				documentOwner.downloads.push(newDownload);
				documentOwner.save();
			}
		}
		for (const file of req.files.documents) {
		await deleteTempFile(file.path);
		}
		req.flash('success','Files has successfully been uploaded');
		res.redirect('back');
	} catch (error) {
		console.log(error);
		req.flash('error', error.message);
		res.redirect('back');
	}	
})



// router.post('/batchupload', isLoggedIn, isAdmin, upload.single('batchfile'), async function (req, res) {
// 	console.log('req.body');
// 	console.log(req.body);
// 	console.log('req.file');
// 	console.log(req.file);
//     console.log('done');
// 	try {

//         let batch = {};
//         batch.name = req.body.name;
//         batch.url = req.file.path;
//         batch.saveid = req.file.filename;
//         let newBatchFile = await Batchupload.create(batch);
//         console.log('newBatchFile');
//         console.log(newBatchFile);
// 		function uploadExcel() {
//             var workbook = XLSX.readFile(`uploads/batch/${req.file.filename}`);
// 			var sheet_name_list = workbook.SheetNames;
// 			console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
// 			var uploadData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
// 			console.log('uploadData');
// 			console.log(uploadData);
// 			return uploadData;
// 		}
// 		let uploadData = uploadExcel();
// 		for (const data of uploadData) {
// 			console.log(data);
// 			console.log('data.author');
// 			console.log(data.author);
// 			console.log('data.path');
// 			console.log(data.path);

// 			let download = {};
// 			download.author = {};
// 			download.file = [];
// 			download.exam = [];
// 			download.attempt = [];
// 			download.subject = [];

// 			console.log('download');
// 			console.log(download);
// 			download.author.id = req.user._id;
// 			download.author.username = data.author;
// 			download.author.displayName = data.author;
// 			download.exam = data.exam;
// 			download.attempt = data.attempt;
// 			download.subject = data.subject;
// 			download.description = data.description;
// 			download.title = data.title;
// 			var newfileName = `${data.filename}_${Date.now()}${data.mime}`;
// 			var bucketName = process.env.GOOGLE_CLOUD_BUCKET;
// 			var filename = data.path;
// 			console.log(filename);


// 			await uploadFile(bucketName, filename, newfileName);

// 			var publicUrl = format(
// 				`https://storage.googleapis.com/${bucketName}/${newfileName}`
// 			);
// 			download.file.push({
// 				url: publicUrl,
// 				public_id: newfileName
// 			});
// 			console.log('Final download');
// 			console.log(download);

// 			var newDownload = await Download.create(download);
// 			console.log('newDownload');
// 			console.log(newDownload);
// 			var documentOwner = await User.findById(req.user._id);
// 			console.log('documentOwner');
// 			console.log(documentOwner);
// 			if (!documentOwner) {
// 				req.flash("error");
// 				res.redirect("/downloads/new");
// 			} else if (documentOwner) {
// 				documentOwner.downloads.push(newDownload);
// 				documentOwner.save();
// 			}
// 		}
// 		req.flash('success', "Your file was successfully uploaded!");
// 		res.redirect("/downloads");

// 	} catch (error) {
// 		console.log(error);
// 		req.flash('error', error.message);
// 		res.redirect('back');
// 	}
// })

router.get("/batch/:id", (req, res) => {
	var batchId = req.params.id;
	Batchupload.findById(req.params.id, (err, foundDocument) => {
		if (err) {
			req.flash('error', err.msg);
			res.redirect('/downloads');
		} else {
			var documentName = foundDocument.name;
			var filesaveid = foundDocument.saveid;
			console.log('documentName');
			console.log(documentName);
			console.log('filesaveid');
			console.log(filesaveid);
			var filemime = filesaveid.slice(filesaveid.indexOf('.'));
			var documentLocation = path.join('uploads', 'batch', filesaveid)
			var file = fs.createReadStream(documentLocation);
			res.setHeader('Content-Disposition', 'inline; filename="' + documentName + '' + filemime + '" ');
			file.pipe(res);
		};
	});
});
router.delete('/batch/:id', async function (req, res) {
	try{
		let batchId = req.params.id;
		let batchfile = await Batchupload.findById(batchId);
		if(!batchfile){
			console.log('err');
		} else{
			fs.unlink(batchfile.url, (err) => console.log(err));
			let deleteBatchfile = await Batchupload.findByIdAndDelete(batchId);
			req.flash('success', 'The file has been successfully deleted!');
			res.redirect('back');
		}
	}catch(error){
		console.log(error);
	}
})
router.get('/api/batch', async function (req, res) {
	let files = await Batchupload.find({});
	res.json({ files });
})

module.exports = router;