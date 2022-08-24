const joi = require('joi');
const bcrypt = require('bcrypt');
const {user} = require('../datamodels/user_dm');
const express = require('express');
const router = express.Router();

router
    .post('/', async (req, res) => {
        try{
            const {error} = validate(req.body);
            if (error) return res.status(400).send({message: "اطلاعات معتبر نیست" , error : error.message});
            const user1 = await user.findOne({number: req.body.number});
            if (!user1) {
                return res.status(400).send('کاربری با این شماره ثبت نشده است')
            } else {
                const validPassword = await bcrypt.compare(req.body.password, user1.password);
                if (!validPassword) return res.status(400).send('رمز عبور اشتباه است');

                const token = user1.generateAuthToken();
                const data_send = {message: "خوش آمدید"}
                res.header("x-auth-token", token).send(data_send).status(200);
            }
        }
        catch (e){
            res.send({message:"خطا در سرور"}).status(500);
        }
    });

function validate(user) {
    const schema = joi.object({
        number: joi.string().min(10).max(11).required(),
        password: joi.string().min(6).max(255).alphanum().required()
    });
    return schema.validate(user);
}
module.exports = router;

