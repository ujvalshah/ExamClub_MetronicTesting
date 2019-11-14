const express = require("express");
const router = express.Router();
const fs = require('fs');
const { format } = require('util');
const { Storage } = require('@google-cloud/storage');
const Download = require("../models/download.js");
const Videos = require("../models/download.js");
const Batchupload = require("../models/batchupload.js");
const User = require("../models/user.js");
const Multer = require('multer');
const path = require("path");
const middleware = require("../middleware");
const moment = require('moment');
const XLSX = require('xlsx');
const { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin, searchAndFilterDocs, sendUploadToGCS, publicURL, uploadFile } = middleware;
const projectId = process.env.GCLOUD_STORAGE_BUCKET;
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const gc = new Storage({ projectId, keyFile });
const upload = Multer({ storage: Multer.memoryStorage() });
const bucketName = process.env.GOOGLE_CLOUD_BUCKET;
const bucket = gc.bucket(bucketName);
//----------------------------------------------------------------------------//
//--------------------------Downloads Routes----------------------------------//
//----------------------------------------------------------------------------//
router.post("/downloadscopy", async function (req, res) {
	try {
		function uploadExcel() {
			var workbook = XLSX.readFile('D:/Data/upload.xlsx');
			var sheet_name_list = workbook.SheetNames;
			console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
			var uploadData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
			console.log('uploadData');
			console.log(uploadData);
			return uploadData;
		}
		let uploadData = uploadExcel();
		for (const data of uploadData) {

			let x = 0;
			console.log(data);
			console.log('data.author');
			console.log(data.author);
			console.log('data.path');
			console.log(data.path);

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
			var newfileName = data.title;
			var bucketName = process.env.GOOGLE_CLOUD_BUCKET;
			var filename = data.path;


			await uploadFile(bucketName, filename, newfileName, data);

			var publicUrl = format(
				`https://storage.googleapis.com/${bucketName}/${newfileName}`
			);
			download.file.push({
				url: publicUrl,
				public_id: filename
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
			x += 1;
			console.log('This is x');
			console.log(x);
		}
		req.flash('success', "Your file was successfully uploaded!");
		res.redirect("/downloads");

	} catch (error) {
		console.log(error);
		req.flash('error', error.message);
	}


});

router.get("/downloads", searchAndFilterDocs, async function (req, res) {
	try {
		console.log('*****Req.Query***********');
		console.log(req.query);
		console.log('*****Req.Query***********');
		const { docdbQuery, docspaginateUrl } = res.locals;
		delete res.locals.docdbQuery;

		console.log('*IMMMMMP****docdbquery****');
		console.log(docdbQuery);

		var foundDownload = await Download.paginate(docdbQuery, {
			populate: { path: 'author.id', model: 'User', select: 'displayName' },
			page: parseInt(req.query.page) || 1,
			limit: parseInt(req.query.limit) || 10,
			sort: req.query.sort || '-createdAt',
		});
		if (!foundDownload) {
			req.flash("error");
			res.redirect("back");
		}
		// var authorFilter = await User.find({ isFaculty: true });
		var attemptsButtons = {
			"Nov 2019": { 'title': "Nov 2019", 'class': 'btn-label-primary', 'mobile': 'kt-badge--unified-primary' },
			"May 2020": { 'title': "May 2020", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
			"Nov 2020": { 'title': "Nov 2020", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
			"May 2021": { 'title': "May 2021", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
			"Nov 2021": { 'title': "Nov 2021", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
			"": { 'title': "None", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
		};

		examsButtons = {
			"CA Final(New)": { 'title': "CA Final(New)", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
			"CA Final(Old)": { 'title': "CA Final(Old)", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
			"CA Intermediate(New)": { 'title': "CA Intermediate(New)", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
			"CA IPCC(Old)": { 'title': "CA IPCC(Old)", 'class': 'btn-label-info', 'mobile': 'kt-badge--unified-info' },
			"CA Foundation": { 'title': "CA Foundation", 'class': 'btn-label-brand', 'mobile': 'kt-badge--unified-brand' },
			"General": { 'title': "General", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
			"": { 'title': "None", 'class': 'btn-label-light', 'mobile': 'kt-badge--unified-light' },
		};

		if (req.xhr) {
			console.log(foundDownload.docs.length);
			foundDownload.pageUrl = docspaginateUrl;
			// foundDownload.docdbQuery = docdbQuery;
			foundDownload.attemptsButtons = attemptsButtons;
			foundDownload.examsButtons = examsButtons;
			// foundDownload.authorFilter = authorFilter;
			if (req.user) {
				let currentUser = await User.findById(req.user._id);
				foundDownload.currentUser = currentUser;
				return res.json(foundDownload);
			}
			return res.json(foundDownload);
		} else {
			console.log('----------');
			console.log(res.locals.docquery);
			console.log('----------');
			console.log(foundDownload.docs.length);
			console.log('----------');
			if (!foundDownload.length && res.locals.query) {
				res.locals.error = 'No results match that query.';
			}
			res.render("index2", { downloads: foundDownload, attemptsButtons, examsButtons, page: "downloads", title: "Downloads" });
		}
	} catch (error) {
		console.log(error);
	}
});



//----------------------------------------------------------------------------//
//----------------------Downloads - Upload - Form-----------------------------//
//----------------------------------------------------------------------------//
router.get("/downloads/upload", isLoggedIn, isTeacherOrAdmin, async function (req, res) {
	res.render("index2", { page: "downloads_uploadform", title: "Document Upload Form" });
	// res.render("downloads/upload");
});


//----------------------------------------------------------------------------//
//------------------------Downloads - POST - Form-----------------------------//
//----------------------------------------------------------------------------//

// With GCP

router.post("/downloads", isLoggedIn, upload.single('document'), async function (req, res, next) {
	try {
		console.log('req.file');
		console.log(req.file);
		console.log('req.body');
		console.log(req.body);
		//Name
		if (req.user.isAdmin) {
			req.body.download.author.id = req.user._id || req.body.download.id;
			req.body.download.author.displayName = req.body.download.author.username;
		}
		if (!req.user.isAdmin) {
			req.body.download.author.id = req.user._id;
			req.body.download.author.displayName = req.user.displayName;
		}
		var originalfileName = req.file.originalname;
		var fileName = originalfileName.slice(0, originalfileName.indexOf('.'));
		var fileMimeType = req.file.mimetype;
		var fileExtenstion = fileMimeType.slice((fileMimeType.indexOf('/') + 1));
		var facultyName = req.body.download.author.displayName.split(' ').join('_');
		console.log('fileExtenstion');
		console.log(fileExtenstion);

		var gcsFileName = `${facultyName}-${fileName}_${Date.now()}.${fileExtenstion}`;
		var blob = bucket.file(gcsFileName);
		var blobStream = blob.createWriteStream({
			metadata: {
				contentType: req.file.mimetype
			},
			gzip: true,
			resumable: false,
		});

		blobStream.on('error', err => {
			next(err);
		});

		blobStream.on('finish', async () => {
			// The public URL can be used to directly access the file via HTTP.
			var publicUrl = format(
				`https://storage.googleapis.com/${bucket.name}/${blob.name}`
			);
			console.log(publicUrl);

			req.body.download.file = [];

			req.body.download.file.push({
				url: publicUrl,
				public_id: blob.name
			});

			let newDownload = await Download.create(req.body.download);
			let documentOwner = await User.findById(req.user._id);
			if (!documentOwner) {
				req.flash("error");
				res.redirect("/downloads/new");
			} else if (documentOwner) {
				documentOwner.downloads.push(newDownload);
				documentOwner.save();
			}
			if(req.xhr){
				res.json("Successfull");	
			} else {
				req.flash('success', "Your file was successfully uploaded!");
				res.redirect("/downloads");
			}
		});

		blobStream.end(req.file.buffer);


	} catch (error) {
		console.log(error);
		req.flash('error', error.message);
		res.redirect('back');
	}

});

//With GCP but W/o Excel
// router.post("/downloads", upload.single('document'), async function (req, res, next) {
// 	try {
// 		console.log('req.file');
// 		console.log(req.file);
// 		console.log('req.body');
// 		console.log(req.body);
// 		//Name
// 		req.body.download.author.id = req.user._id;
// 		if (req.user.isAdmin) {
// 			req.body.download.author.displayName = req.body.download.author.username;
// 		}
// 		if (!req.user.isAdmin) {
// 			req.body.download.author.displayName = req.user.displayName;
// 		}
// 		var originalfileName = req.file.originalname;
// 		var fileName = originalfileName.slice(0, originalfileName.indexOf('.'));
// 		var fileMimeType = req.file.mimetype;
// 		var fileExtenstion = fileMimeType.slice((fileMimeType.indexOf('/') + 1));
// 		var facultyName = req.body.download.author.displayName.split(' ').join('_');
// 		console.log('fileExtenstion');
// 		console.log(fileExtenstion);

// 		var gcsFileName = `${facultyName}-${fileName}_${Date.now()}.${fileExtenstion}`;
// 		var blob = bucket.file(gcsFileName);
// 		var blobStream = blob.createWriteStream({
// 			metadata: {
// 				contentType: req.file.mimetype
// 			},
// 			gzip: true,
// 			resumable: false,
// 		});

// 		blobStream.on('error', err => {
// 			next(err);
// 		});

// 		blobStream.on('finish', async () => {
// 			// The public URL can be used to directly access the file via HTTP.
// 			var publicUrl = format(
// 				`https://storage.googleapis.com/${bucket.name}/${blob.name}`
// 			);
// 			console.log(publicUrl);

// 			req.body.download.file = [];

// 			req.body.download.file.push({
// 				url: publicUrl,
// 				public_id: blob.name
// 			});

// 			let download = await Download.create(req.body.download);
// 			let documentOwner = await User.findById(req.user._id);
// 			if (!documentOwner) {
// 				req.flash("error");
// 				res.redirect("/downloads/new");
// 			} else if (documentOwner) {
// 				documentOwner.downloads.push(download);
// 				documentOwner.save();
// 			}
// 			req.flash('success', "Your file was successfully uploaded!");
// 			res.redirect("/downloads");
// 		});

// 		blobStream.end(req.file.buffer);


// 	} catch (error) {
// 		console.log(error);
// 		req.flash('error', error.message);
// 		res.redirect('back');
// 	}

// });


//----------------------------------------------------------------------------//
//-------------------Downloads - Update Form Route-----------------------------//
//----------------------------------------------------------------------------//
router.get("/downloads/:id/edit", isLoggedIn, isTeacherOrAdmin, async function (req, res) {
	try {
		var download = await Download.findById(req.params.id);
		var loggedUser = await User.findById(req.user._id);
		console.log(download);
		if (!download) {
			req.flash("error", err.message);
			res.redirect("/downloads");
		}
		if (req.user._id.toString() === download.author.id.toString() || loggedUser.isAdmin === true) {
			res.render("index2", { download: download, page: "downloads_updateform", title: "Document Update Form" });
			// res.render("downloads/updateform", {download:download});
		} else {
			req.flash("error", 'To edit you must be the owner of the document.');
			res.redirect("/downloads");
		};
	} catch (error) {
		console.log(error);
		req.flash('error', error.message);
		res.redirect('back');
	}
});

//----------------------------------------------------------------------------//
//-------------------Downloads - Update Put Route-----------------------------//
//----------------------------------------------------------------------------//
router.put("/downloads/:id", isLoggedIn, upload.single('document'), async function (req, res) {
	try {
		var loggedUser = await User.findById(req.user._id);
		var documentToUpdate = await Download.findById(req.params.id);
		if (!documentToUpdate) {
			console.log(error);
			req.flash('error', "The document can't be located. Please try again!");
			res.redirect('back');
		}
		if (req.user._id.toString() === documentToUpdate.author.id.toString() || loggedUser.isAdmin === true) {
			var filename = documentToUpdate.file[0].public_id
			if (req.file) {
				// [START storage_delete_file]
				// Deletes the file from the bucket
				console.log(filename);

				var file = bucket.file(filename);

				file.exists(async function (err, exists) {
					if (err) {
						console.log(err)
					} else if (exists) {
						console.log('There')
						console.log('exists');
						console.log(exists);
						// [START storage_delete_file]
						// Deletes the file from the bucket
						await gc
							.bucket(bucketName)
							.file(filename)
							.delete();
						console.log(`gs://${bucketName}/${filename} deleted.`);
						// [END storage_delete_file]
					}
				});
				console.log('Does not exist!');
				for (let oldFile of documentToUpdate.file) {
					let index = documentToUpdate.file.indexOf(oldFile);
					await documentToUpdate.file.splice(index, 1);
				};
				// [START storage_upload_file]
				if (req.user.isAdmin) {
					documentToUpdate.author.displayName = req.body.download.author.username;
					documentToUpdate.author.username = req.body.download.author.username;
					documentToUpdate.author.id = req.user.id;
				}
				if (!req.user.isAdmin) {
					documentToUpdate.author.username = req.user.username;
					documentToUpdate.author.displayName = req.user.displayName;
					documentToUpdate.author.id = req.user.id;
				}
				var originalfileName = req.file.originalname;
				var fileName = originalfileName.slice(0, originalfileName.indexOf('.'));
				var fileMimeType = req.file.mimetype;
				var fileExtenstion = fileMimeType.slice((fileMimeType.indexOf('/') + 1));
				var facultyName = documentToUpdate.author.displayName.split(' ').join('_');

				var gcsFileName = `${facultyName}-${fileName}_${Date.now()}.${fileExtenstion}`;
				var blob = bucket.file(gcsFileName);
				var blobStream = blob.createWriteStream({
					metadata: {
						contentType: req.file.mimetype
					},
					gzip: true,
					resumable: false,
				});

				blobStream.on('error', err => {
					next(err);
				});

				blobStream.on('finish', async () => {
					// The public URL can be used to directly access the file via HTTP.
					var publicUrl = format(
						`https://storage.googleapis.com/${bucket.name}/${blob.name}`
					);
					console.log(publicUrl);
					documentToUpdate.file.push({
						url: publicUrl,
						public_id: blob.name
					});
					documentToUpdate.title = req.body.download.title;
					documentToUpdate.description = req.body.download.description;
					documentToUpdate.topic = req.body.download.topic;
					documentToUpdate.exam = req.body.download.exam;
					documentToUpdate.attempt = req.body.download.attempt;
					documentToUpdate.subject = req.body.download.subject;
					await documentToUpdate.save();
					console.log('REQ.FILE USED');

					req.flash("success", "Successfully Updated!");
					res.redirect("/downloads");
				});

				blobStream.end(req.file.buffer);
				// [END storage_upload_file]
			} else {
				if (req.user.isAdmin) {
					documentToUpdate.author.displayName = req.body.download.author.username;
					documentToUpdate.author.username = req.body.download.author.username;
					documentToUpdate.author.id = req.user.id;
				}
				if (!req.user.isAdmin) {
					documentToUpdate.author.username = req.user.username;
					documentToUpdate.author.displayName = req.user.displayName;
					documentToUpdate.author.id = req.user.id;
				}

				documentToUpdate.title = req.body.download.title;
				documentToUpdate.description = req.body.download.description;
				documentToUpdate.topic = req.body.download.topic;
				documentToUpdate.exam = req.body.download.exam;
				documentToUpdate.attempt = req.body.download.attempt;
				documentToUpdate.subject = req.body.download.subject;
				await documentToUpdate.save();
				console.log('REQ.FILE NOT USED');
				req.flash("success", "Successfully Updated!");
				res.redirect("/downloads");
			}
		} else {
			req.flash('error', 'You must be the owner of the document to edit it.')
			res.redirect('back');
		};
	} catch (error) {
		console.log(error);
		req.flash('error', error.message);
		res.redirect('back');
	}
});

//----------------------------------------------------------------------------//
//------------------------Downloads - Delete - Form---------------------------//
//----------------------------------------------------------------------------//
router.delete("/downloads/:id", isLoggedIn, async function (req, res) {
	try {
		var loggedUser = User.findById(req.user._id);
		let docs = await Download.findById(req.params.id);
		console.log(docs);
		console.log(req.user._id);
		if (req.user._id.toString() === docs.author.id.toString() || loggedUser.isAdmin === true) {
			let filename = docs.file[0].public_id;
			console.log('filename');
			console.log(filename);
			var file = bucket.file(filename);
			file.exists(async function (err, exists) {
				if (err) {
					console.log(err)
				} else if (exists) {
					console.log('There')
					console.log('exists');
					console.log(exists);
					// [START storage_delete_file]
					// Deletes the file from the bucket
					await gc
						.bucket(bucketName)
						.file(filename)
						.delete();
					console.log(`gs://${bucketName}/${filename} deleted.`);
					// [END storage_delete_file]
				}
			});

			let updatedUser = await User.findByIdAndUpdate(req.user._id, { $pull: { downloads: req.params.id } });
			docs.remove();
			req.flash('success', 'Your file was successfully deleted!')
			res.redirect("back");
		} else {
			req.flash('error', "You must be the owner of the document to delete it.");
			return res.redirect('/downloads');
		}
	} catch (error) {
		console.log(error);
		req.flash('error', error.message);
		res.redirect('back');
	}
});




//----------------------------------------------------------------------------//
//-----------------------------Downloads Counter------------------------------//
//----------------------------------------------------------------------------//




router.put("/download/:id/counter", async (req, res) => {
	try {
		let downloadCounter = await Download.findById(req.params.id);
		if (!downloadCounter) {
			console.log(err);
			return res.send(err);
		} else {
		let	downloadCounterUpdate = await Download.findByIdAndUpdate(downloadCounter, { $inc: { 'downloadCounter': 1 }}, { new: true });
			if (!downloadCounterUpdate) {
				console.log(err);
				return res.send(err);
			} else {
				console.log('Success');
			}
			res.end();
		}
	} catch (error) {
		console.log(error);
	}

});
// If user needs to be logged in
// router.put("/download/:id/counter", async (req, res) => {
// 	try {
// 		if (req.user) {
// 			let userCounter = await User.findById(req.user.id);
// 			if (!userCounter) {
// 				console.log(err);
// 				return res.send(err);
// 			} else {
// 				let downloadCounter = await Download.findById(req.params.id);
// 				if (!downloadCounter) {
// 					console.log(err);
// 					return res.send(err);
// 				} else {
// 					userDownloadData = {
// 						id: userCounter,
// 					};
// 					downloadCounterUpdate = await Download.findByIdAndUpdate(downloadCounter, { $inc: { 'downloadCounter': 1 }, $addToSet: { downloadStudents: { id: userCounter, username: userCounter.username } } }, { new: true });
// 					if (!downloadCounterUpdate) {
// 						console.log(err);
// 						return res.send(err);
// 					} else {
// 						console.log('Success');
// 					}
// 					res.json([{ downloadCounter }, { userCounter }]);
// 				}
// 			}
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}

// });

//Bookmark
//Async Version 1.3
router.put("/user/downloads/:id/bookmark", async (req, res) => {
	try {
		let foundUser = await User.findById(req.user.id);
		if (!foundUser) { res.json([{ msg: "You need to be signed in!" }]); }
		let foundDownload = await Download.findById(req.params.id);
		var exists = foundUser.downloadBookmarks.indexOf(req.params.id);
		console.log(exists);
		if (exists !== -1 || undefined) {
			User.findByIdAndUpdate(req.user.id,
				{ $pull: { downloadBookmarks: req.params.id } }, (err, result) => {
					if (err) {
						console.log(err);
					} else {
						if (req.xhr) {
							res.json([{ msg: `${foundDownload.title} is removed from your bookmarks` }]);
						} else {
							req.flash("success", "Bookmark was succesfully removed")
							res.redirect("back");
						};
					};
				});
		} else {
			// let foundDownload = await Download.findById(req.params.id);
			if (!foundDownload) { res.json([{ msg: "We encountered some issue. Please try again!" }]); }
			foundUser.downloadBookmarks.push(foundDownload);
			foundUser.save();
			if (req.xhr) {
				res.json([{ msg: `${foundDownload.title}  is added to your bookmarks` }]);
			} else {
				res.redirect("back");
			}
		};
	}
	catch (error) {
		req.flash("error", error.message);
		return res.render("back");
	}
});

//DOWNLOAD
router.get("/downloads/docs/:id", async function (req, res) {


	// Downloads the file
	let documentToDownload = await Download.findById(req.params.id);
	if (!documentToDownload) {
		req.flash("error", "The document cannot be found. Please try again!");
		res.redirect('back');
	}
	let srcUrl = documentToDownload.file[0].url;
	console.log('srcUrl');
	console.log(srcUrl);
	res.redirect(srcUrl);
	// [END storage_download_file]
});

//----------------------------------------------------------------------------//
//----------------------Downloads - Share-Landing Page------------------------//
//----------------------------------------------------------------------------//
router.get('/downloads/:id', async (req, res) => {
	try {
		var document = await Download.findById(req.params.id);
		var authorDocs = await Download.find({ 'author.username': document.author.username, 'attempt': document.attempt }).sort('-createdAt');
		var authorVideos = await Videos.find({ 'author.username': document.author.username, 'attempt': document.attempt }).sort('-createdAt');
		// var authorDocs = await Download.find({ 'author.id': document.author.id, 'exam': document.exam, 'attempt': document.attempt }).sort('-createdAt');
		// var authorVideos = await Videos.find({ 'author.id': document.author.id });
		var author = await User.findById(document.author.id).populate('downloads[0][id]');
		console.log('document');
		console.log(document);

		if (!document) {
			req.flash('error', 'Please try again');
			res.redirect('/downloads');
		}
		let documentName = document.title;
		res.render('index2', { page: "downloads_document", title: `Download ${documentName}`, document, author, authordocs: authorDocs, authorvideos: authorVideos, });
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('/downloads');
	}
})
// router.get('/downloads/:id', async (req, res) => {
// 	try {
// 		var document = await Download.findById(req.params.id);
// 		var authorid = await User.findById(document.author.id);
// 		if (!document) {
// 			req.flash('error', 'Please try again');
// 			res.redirect('/downloads');
// 		}
// 		let downloadUrl = document.file[0].url;
// 		res.redirect(downloadUrl);
// 	} catch (error) {
// 		req.flash('error', error.message);
// 		res.redirect('/downloads');
// 	}


// })

module.exports = router;
	// 		console.log(downloadUrl);