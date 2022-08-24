const express = require('express');
const router = express.Router();
const {drug, drugValidator} = require("../datamodels/drug_dm");
const {drug_kind} = require("../datamodels/drug_kind_dm");
const {drug_group} = require("../datamodels/drug_group_dm");
const {drug_format} = require("../datamodels/drug_format_dm");

const auth = require("../midelwaers/auth");
const admin = require("../midelwaers/user_kind");
const validObjectId = require("../midelwaers/valid_objectid");
const joi = require("joi");
const fs = require("fs");
const multer = require('multer');
const {reject} = require("bcrypt/promises");
const dir = 'Json-uploads/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const multerFile = multer({storage: storage});

router
    .post("/withJsonFile", [multerFile.single("JsonFile")], async (req, res) => {
        try {
            console.log(JSON.stringify(req.file));
            const fs = require('fs');
            const objs = JSON.parse(fs.readFileSync(dir + req.file.filename, 'utf8'));
            for (let i = 0; i < objs.length; i++) {
                await create_promise(objs[i], i).then(async (obj) => {
                    console.log("finished " + obj.group)
                    console.log("finished " + obj.kind)
                    console.log("finished " + obj.format)
                    const {error} = drugValidator(obj);
                    if (error) return res.status(400).send({message: "اطلاعات نامعتبر است", error: error.message});
                    const saved_drug = await new drug(obj).save();
                    if (!saved_drug) return res.status(500).send({message: "لطفا دقایقی بعد دوباره امتحان کنید"});
                }, () => {
                })
            }
            res.send("با موفقیت ثبت شد").status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    })
    .post("/", [auth, admin], async (req, res) => {
        try {
            console.log("in post")
            const {error} = drugValidator(req.body);
            if (error) return res.status(400).send({message: "اطلاعات نامعتبر است", error: error.message});
            const new_drug = new drug({
                name: req.body.name,
                symbol: req.body.symbol,
                kind: req.body.kind,
                group: req.body.group,
                description: req.body.description,
                irc: req.body.irc,
                genericId: req.body.genericId,
                erx: req.body.erx,
                insuranceCover: req.body.insuranceCover,
                validSince: req.body.validSince,
                validUntil: req.body.validUntil,
                price: req.body.price,
                basePrice: req.body.basePrice,
                format: req.body.format,
                searchTerm: req.body.searchTerm,
            });
            const saved_drug = await new_drug.save();
            res.send(saved_drug).status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    })
    .delete("/:id", [auth, admin, validObjectId], async (req, res) => {
        try {
            const del_drug = await drug.findByIdAndRemove(req.params.id);
            if (!del_drug) return res.status(404).send({message: 'دارویی با این مشخصه وجود ندارد'});
            res.send(del_drug).status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    })
    .put("/:id", [auth, admin, validObjectId], async (req, res) => {
        // const {error} = drugValidator(req.body);
        // if (error) return res.status(400).send({message: "اطلاعات نامعتبر است."});
        try {
            const new_drug = await drug.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
            if (!new_drug) return res.status(404).send({message: 'دارویی با این مشخصه وجود ندارد'});
            console.log("req.body is ==========> " + JSON.stringify(req.body))
            res.send(new_drug).status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    })
    ///////////////
    .get("/", [auth], async (req, res) => {
        try {
            let apartments;

            const filters = [];
            const price = req.query.price ? {"price": {$gt: parseInt(req.query.price)}} : null;
            const insuranceCover = req.query.insuranceCover ? {"insuranceCover": req.query.insuranceCover} : null;
            const format = req.query.format ? {"format.name": req.query.format} : null;

            if (price !== null) {
                filters.push(price);
            }
            if (insuranceCover !== null) {
                filters.push(insuranceCover);
            }
            if (format !== null) {
                filters.push(format);
            }
            console.log(filters);
            const page = req.query.page ? (req.query.page - 1) : 0;
            const limit = req.query.limit ? req.query.limit : 9;
            const skip = page * limit;
            console.log("skip = " + skip + "page = " + page + "limit = " + limit)
            drug.aggregate([
                {
                    '$lookup': {
                        'from': 'drug_groups',
                        'localField': 'group',
                        'foreignField': '_id',
                        'as': 'group'
                    }
                }, {
                    '$unwind': {
                        'path': '$group',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$lookup': {
                        'from': 'drug_kinds',
                        'localField': 'kind',
                        'foreignField': '_id',
                        'as': 'kind'
                    }
                }, {
                    '$unwind': {
                        'path': '$kind',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$lookup': {
                        'from': 'drug_formats',
                        'localField': 'format',
                        'foreignField': '_id',
                        'as': 'format'
                    }
                }, {
                    '$unwind': {
                        'path': '$format',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$match': {
                        '$and': filters
                    }
                }
            ]).exec((err, drugs) => {
                if (err) return res.send({message: "خطا", err}).status(404);
                if (drugs) return res.send(drugs).status(200)
            })
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }

    })

    .get("/:id", [auth, validObjectId], async (req, res) => {

        try {
            const id = req.params.id;
            const apartments = await drug.findById(id);
            if (!apartments) return res.status(404).send({message: 'آپارتمانی برای معامله وجود ندارد'});
            res.send(apartments).status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    });
//////////////


const create_promise = (obj, index) => new Promise(async (resolve, reject) => {
    const group_id = await drug_group.findOne({name: obj.group}).select("_id");
    const format_id = await drug_format.findOne({name: obj.format}).select("_id");
    const kind_id = await drug_kind.findOne({name: obj.kind}).select("_id");
    console.log(obj.name + ` index=${index} => ` + group_id + " " + format_id + " " + kind_id);
    if (group_id === null) {
        console.log("in if1")
        const new_group = new drug_group({name: obj.group});
        const saved_group = await new_group.save();
        obj.group = saved_group._id;
    } else {
        console.log("in else1")
        obj.group = group_id;
    }
    if (format_id === null) {
        console.log("in if2")
        const new_format = new drug_format({name: obj.format});
        const saved_format = await new_format.save();
        obj.format = saved_format._id;
    } else {
        console.log("in else2")
        obj.format = format_id;
    }
    if (kind_id === null) {
        console.log("in if3")
        const new_kind = new drug_kind({name: obj.kind});
        const saved_kind = await new_kind.save();
        obj.kind = saved_kind._id;
    } else {
        console.log("in else3")
        obj.kind = kind_id;
    }
    console.log(obj.name + ` index=${index} => ` + group_id + " " + format_id + " " + kind_id);
    obj.validUntil === "" ? obj.validUntil = 0 : null;
    resolve(obj, index);
})
module.exports = router;