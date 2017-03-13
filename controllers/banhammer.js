'use strict';

const moment = require('moment');
const bot = require('../core/telegram');
const tgresolve = require("tg-resolve");
const config = require('../core/config');
const Ban = require('../models/banmodel');
const Mod = require('../models/modsmodel');

bot.onText(/^[\/!#]hammer$/, msg => {
    Mod.count({
        userid: msg.from.id
    }, (err, count) => {
        if (count > 0 || config.SUDO == msg.from.id) {
            bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id);
            let newBan = new Ban({
                userid: msg.reply_to_message.from.id,
                name: msg.reply_to_message.from.first_name
            });
            newBan.save(err => {
                if (err && err.code === 11000) {
                    bot.sendMessage(msg.chat.id, `*${msg.reply_to_message.from.first_name}*, تم حظره عام مسبقا!`, {parse_mode: 'Markdown'});
                } else {
                    bot.sendMessage(msg.chat.id, `*${msg.reply_to_message.from.first_name}*, محظور عام!`, {parse_mode: 'Markdown'});
                    bot.sendMessage(config.LOG_CHANNEL, `*${msg.reply_to_message.from.first_name}*, تم حظره عام!\nمن قبل: _${msg.from.first_name}_\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف في البوت!`, {parse_mode: 'Markdown'});
        }
    });
});

bot.onText(/^[\/!#]unhammer$/, msg => {
    Mod.count({
        userid: msg.from.id
    }, (err, count) => {
        if (count > 0 || config.SUDO == msg.from.id) {
            bot.unbanChatMember(msg.chat.id, msg.reply_to_message.from.id);
            Ban.remove({
                userid: msg.reply_to_message.from.id
            }, () => {
                // Globally Unhammered
            });
            bot.sendMessage(msg.chat.id, `*${msg.reply_to_message.from.first_name}*, تم فك الحظر العام!`, {parse_mode: 'Markdown'});
            bot.sendMessage(config.LOG_CHANNEL, `*${msg.reply_to_message.from.first_name}*, تم فك الحظر العام!\nمن قبل: _${msg.from.first_name}_\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
        } else {
            bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف في البوت!`, {parse_mode: 'Markdown'});
        }
    });
});

bot.onText(/[\/!#]hammer (\d+)/, (msg, match) => {
    Mod.count({
        userid: msg.from.id
    }, (err, count) => {
        if (count > 0 || config.SUDO == msg.from.id) {
            let newBan = new Ban({
                userid: match[1]
            });
            newBan.save(err => {
                if (err && err.code === 11000) {
                    bot.sendMessage(msg.chat.id, `*${match[1]}*, تم حظره عام مسبقا!`, {parse_mode: 'Markdown'});
                } else {
                    bot.sendMessage(msg.chat.id, `*${match[1]}*, محظور عام!`, {parse_mode: 'Markdown'});
                    bot.sendMessage(config.LOG_CHANNEL, `_(${match[1]})_, تم حظره عام!\nمن قبل: _${msg.from.first_name}_\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
                }
            });
        } else {
            bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف في البوت!`, {parse_mode: 'Markdown'});
        }
    });
});

bot.onText(/[\/!#]unhammer (\d+)/, (msg, match) => {
    Mod.count({
        userid: msg.from.id
    }, (err, count) => {
        if (count > 0 || config.SUDO == msg.from.id) {
            Ban.remove({
                userid: match[1]
            }, (err, cb) => {
                if (cb.result.n == 0) {
                    console.log('User Not Found!')
                }
            });
            bot.sendMessage(msg.chat.id, `*${match[1]}*, تم فك الحظر العام!`, {parse_mode: 'Markdown'});
            bot.sendMessage(config.LOG_CHANNEL, `_(${match[1]})_, تم فك الحظر العام!\nمن قبل: _${msg.from.first_name}_\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
        } else {
            bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف في البوت!`, {parse_mode: 'Markdown'});
        }
    });
});

bot.onText(/[\/!#]hammer (@\w+)/, (msg, match) => {
    Mod.count({
        userid: msg.from.id
    }, (err, count) => {
        if (count > 0 || config.SUDO == msg.from.id) {
            tgresolve(config.BOT_TOKEN, match[1], (error, result) => {
            let newBan = new Ban({
                userid: result.id,
            });
                console.log(result)
            newBan.save(err => {
                if (err && err.code === 11000) {
                    bot.sendMessage(msg.chat.id, `*${result.first_name}*, تم حظره عام مسبقا!`, {parse_mode: 'Markdown'});
                } else {
                    bot.sendMessage(msg.chat.id, `*${result.first_name}*, محظور عام!`, {parse_mode: 'Markdown'});
                    bot.sendMessage(config.LOG_CHANNEL, `*${result.first_name}* _(${result.id})_, تم حظره عام!\nمن قبل: _${msg.from.first_name}_\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
                }
            });
        });
        } else {
            bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف في البوت!`, {parse_mode: 'Markdown'});
        }
    });
});

bot.onText(/[\/!#]unhammer (@\w+)/, (msg, match) => {
    Mod.count({
        userid: msg.from.id
    }, (err, count) => {
        if (count > 0 || config.SUDO == msg.from.id) {
            tgresolve(config.BOT_TOKEN, match[1], (error, result) => {
            Ban.remove({
                userid: result.id
            }, (err, cb) => {
                if (cb.result.n == 0) {
                    console.log('User Not Found!')
                }
            });
            bot.sendMessage(msg.chat.id, `*${result.first_name}*, تم فك الحظر العام!`, {parse_mode: 'Markdown'});
            bot.sendMessage(config.LOG_CHANNEL, `*${result.first_name}* _(${result.id})_,تم فك الحظر العام!\nمن قبل: _${msg.from.first_name}_\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
        });
        } else {
            bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف في البوت!`, {parse_mode: 'Markdown'});
        }
    });
});
