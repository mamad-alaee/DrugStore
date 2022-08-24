const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require("../midelwaers/auth");
const admin = require("../midelwaers/user_kind");
const validObjectId = require("../midelwaers/valid_objectid");
const create_normal_user = require("../midelwaers/create_normal_user");

const {user,userValidator} = require("../datamodels/user_dm");
const {user_kind} = require("../datamodels/user_kind_dm");
const joi = require("joi");




router
    .post("/",[create_normal_user,auth,admin], async (req, res) => {

        try {
            const {error} = userValidator(req.body);
            if (error) return res.status(400).send({message: "اطلاعات نامعتبر است"});
            const create_user = await user.findOne({number: req.body.number});
            if (create_user) return res.status(404).send({message: 'این کاربر قبلا ثبت نام شده است'});

            const saltRounds = 10;
            const pass = await bcrypt.hash(req.body.password, saltRounds);

            const user_k = await user_kind.findOne({name:req.body.kind}).select("_id");

            const new_user = new user({
                name: req.body.name,
                family: req.body.family,
                password: pass,
                number: req.body.number,
                kind: user_k._id
            });
            const saved_user = await new_user.save();
            res.send("به جمع ما خوش آمدید").status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    })
    .delete("/:id",[auth,admin,validObjectId], async (req, res) => {

        try {
            const del_user = await user.findByIdAndRemove(req.params.id);
            if (!del_user) return res.status(404).send({message: 'کاربری با این مشخصه وجود ندارد'});
            res.send(del_user).status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    })
    .put("/:id",[auth,admin,validObjectId], async (req, res) => {
        try {
            const new_user = await user.findOneAndUpdate({_id:req.params.id},req.body, {new : true});
            if (!new_user) return res.status(404).send({message: 'کاربری با این مشخصه وجود ندارد'});
            res.send(new_user).status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }

    })
    .get("/",[auth,admin], async (req, res) => {
        try {
            const users = await user.find();
            if (!users) return res.status(404).send({message: 'کاربری وجود ندارد'});
            res.send(users).status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    })
    .get("/:id",[auth,admin,validObjectId],async (req, res) => {
        try {
            const users = await user.findById(req.params.id);
            if (!users) return res.status(404).send({message: 'کاربری با این مشخصه وجود ندارد'});
            res.send(users).status(200);
        } catch (e) {
            res.send({message: "لطفا دقایقی بعد دوباره امتحان کنید", error: e}).status(500);
        }
    });

module.exports = router;