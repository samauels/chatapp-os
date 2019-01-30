import io from 'socket.io-client'
import Vue from 'vue'
import VueFocus from 'vue-focus'
import dateFormat from 'dateformat'

document.body.insertAdjacentHTML('afterbegin', require('./app.html'));

var socket = io(widget.host);

new Vue({
    el: '#widget',
    mixins: [VueFocus.mixin],
    data: {
        id: null,
        message: '',
        messages: [],
        unread: false,
        chatActive: false,
        loggedIn: false,
        details: { name: "" }
    },
    updated: function () {
        this.$nextTick(function() {
            if (!this.unread) return;

            let messagesBody = this.$el.querySelector('.messages-body');
            if (messagesBody) messagesBody.scrollTop = messagesBody.scrollHeight;
            this.unread = false;
        });
    },
    methods: {
        showChat: function() {
            this.chatActive = true;

            let style = widget.frame.style;
            style.width = '300px';
            if (this.loggedIn) {
                style.height = '500px';
            } else {
                style.height = (104 + (87 * Object.keys(this.details).length)) + 'px';
            }
        },
        hideChat: function(logout) {
            this.chatActive = false;
            if (logout) {
                if (logout >= 2) {
                    socket.emit('logout', logout === 3);
                }

                this.loggedIn = false;
                this.message = '';
                this.messages = [];
            }

            let style = widget.frame.style;
            style.width = '105px';
            style.height = '60px';
        },
        login: function() {
            if (!this.details.name) return;

            socket.emit('login', Object.assign({}, this.details, { id: this.id }));
            this.loggedIn = true;
            this.showChat();
        },
        send: function() {
            if (!this.message) return;

            socket.emit('send', this.message);
            this.message = '';
        },
        formatDate: function(date) {
            return dateFormat(+date, "h:MM:ss tt");
        }
    },
    mounted: function() {
        socket.on('connect', function() {
            if (!this.id) {
                this.id = localStorage.getItem('widget-id');
                if (!this.id) {
                    this.id = (+new Date()).toString(36) + socket.id;
                    localStorage.setItem('widget-id', this.id);
                }
            } else {
                this.hideChat(1);
            }

            socket.emit('hello', {
                key: 'test',
                id: this.id,
                url: window.top.location.href
            });
        }.bind(this));

        socket.on('online', function(details) {
            if (this.loggedIn) return;

            this.details.name = details.name;
            this.login();
        }.bind(this));

        socket.on('offline', function() {
            if (!this.loggedIn) return;

            this.hideChat(2);
        }.bind(this));

        socket.on('message', function(message) {
            if (!this.loggedIn) return;

            this.messages.push(message);
            this.unread = true;
        }.bind(this));

        socket.on('room', function(room) {
            this.messages = room.messages;
            this.unread = true;
        }.bind(this));

        let style = widget.frame.style;
        style.right = '3px';
        style.bottom = '3px';
        style.position = 'fixed';
        style.borderStyle = 'solid';
        style.borderColor = '#f0f0f0';
        this.hideChat(0);

        socket.on('active', function(active) {
            style.display = active ? 'block' : 'none';
        });
    }
});
