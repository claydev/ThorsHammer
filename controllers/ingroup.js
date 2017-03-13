'use strict';

const moment = require('moment');
const tgresolve = require("tg-resolve");
const bot = require('../core/telegram');
const config = require('../core/config');
const Mod = require('../models/modsmodel');

bot.onText(/^[\/!#]leave$/, msg => {
    if (msg.from.id == config.SUDO) {
        bot.leaveChat(msg.chat.id);
    } else {
        bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست ادمن!`, {parse_mode: 'Markdown'});
    }
});

bot.onText(/^[\/!#]promote$/, msg => {
    if (msg.from.id == config.SUDO) {
        let newMod = new Mod({
            userid: msg.reply_to_message.from.id,
            name: msg.reply_to_message.from.first_name
        });
        newMod.save(err => {
            if (err && err.code === 11000) {
                bot.sendMessage(msg.chat.id, `*${msg.reply_to_message.from.first_name}*, انه مشرف عام بالفعل`, {parse_mode: 'Markdown'});
            } else {
                bot.sendMessage(msg.chat.id, `*${msg.reply_to_message.from.first_name}*, تم ترقيته لمشرف عام!`, {parse_mode: 'Markdown'});
                bot.sendMessage(config.LOG_CHANNEL, `*${msg.reply_to_message.from.first_name}*, تم ترقيته لمشرف عام!\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
            }
        });
    } else {
        bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف عام في البوت!`, {parse_mode: 'Markdown'});
    }
});

bot.onText(/^[\/!#]demote$/, msg => {
    if (msg.from.id == config.SUDO) {
        Mod.remove({
            userid: msg.reply_to_message.from.id
        }, () => {
            // Demote A Global Admin
        });
        bot.sendMessage(msg.chat.id, `*${msg.reply_to_message.from.first_name}*, تم حذفه من المشرفين!`, {parse_mode: 'Markdown'});
        bot.sendMessage(config.LOG_CHANNEL, `*${msg.reply_to_message.from.first_name}*, تم حذفه من المشرفين!\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
    } else {
        bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف عام في البوت!`, {parse_mode: 'Markdown'});
    }
});

bot.onText(/[\/!#]promote (\d+) (.+)/, (msg, match) => {
    if (msg.from.id == config.SUDO) {
        let newMod = new Mod({
            userid: match[1],
            name: match[2]
        });
        newMod.save(err => {
            if (err && err.code === 11000) {
                bot.sendMessage(msg.chat.id, `*${match[2]}*,  انه مشرف عام بالفعل`, {parse_mode: 'Markdown'});
            } else {
                bot.sendMessage(msg.chat.id, `*${match[2]}*, تم ترقيته لمشرف عام!`, {parse_mode: 'Markdown'});
                bot.sendMessage(config.LOG_CHANNEL, `*${match[2]}* _(${match[1]})_, تم ترقيته لمشرف عام!\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
            }
        });
    } else {
        bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*,  انت لست مشرف عام في البوت!`, {parse_mode: 'Markdown'});
    }
});

bot.onText(/[\/!#]demote (\d+) (.+)/, (msg, match) => {
    if (msg.from.id == config.SUDO) {
        Mod.remove({
            userid: match[1]
        }, () => {
            // Demote A Global Admin
        });
        bot.sendMessage(msg.chat.id, `*${match[2]}*, تم حذفه من المشرفين!`, {parse_mode: 'Markdown'});
        bot.sendMessage(config.LOG_CHANNEL, `*${match[2]}* _(${match[1]})_, تم حذفه من المشرفين!\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
    } else {
        bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف عام في البوت!`, {parse_mode: 'Markdown'});
    }
});

bot.onText(/[\/!#]promote (@\w+) (.+)/, (msg, match) => {
    if (msg.from.id == config.SUDO) {
        tgresolve(config.BOT_TOKEN, match[1], (error, result) => {
        let newMod = new Mod({
            userid: result.id,
            name: result.first_name
        });
        newMod.save(err => {
            if (err && err.code === 11000) {
                bot.sendMessage(msg.chat.id, `*${result.first_name}*,  انه مشرف عام بالفعل`, {parse_mode: 'Markdown'});
            } else {
                bot.sendMessage(msg.chat.id, `*${result.first_name}*, تم ترقيته لمشرف عام!`, {parse_mode: 'Markdown'});
                bot.sendMessage(config.LOG_CHANNEL, `*${result.first_name}* _(${result.id})_, تم ترقيته لمشرف عام!\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
            }
        });
    });        
    } else {
        bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف عام في البوت!`, {parse_mode: 'Markdown'});
    }
});

bot.onText(/[\/!#]demote (@\w+) (.+)/, (msg, match) => {
    if (msg.from.id == config.SUDO) {
        tgresolve(config.BOT_TOKEN, match[1], (error, result) => {
        Mod.remove({
            userid: result.id
        }, () => {
            // Demote A Global Admin
        });
        bot.sendMessage(msg.chat.id, `*${result.first_name}*,  تم حذفه من المشرفين!`, {parse_mode: 'Markdown'});
        bot.sendMessage(config.LOG_CHANNEL, `*${result.first_name}* _(${result.id})_,  تم حذفه من المشرفين!\n${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {parse_mode: 'Markdown'});
    });        
    } else {
        bot.sendMessage(msg.chat.id, `*${msg.from.first_name}*, انت لست مشرف عام في البوت!`, {parse_mode: 'Markdown'});
    }
});
