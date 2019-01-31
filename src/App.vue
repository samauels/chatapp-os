<template>
  <div :style="{background: backgroundColor}">
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="true"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling" />
      <button @click="openChat">Click to Login</button>
  </div>
</template>

<script>



import messageHistory from './messageHistory'
import chatParticipants from './chatProfiles'
import Header from './Header.vue'
import Footer from './Footer.vue'
import TestArea from './TestArea.vue'
import availableColors from './colors'

export default {
  name: 'app',
  components: {
    Header, Footer, TestArea
  },
  data() {
    return {
      participants: [{
    id: 'mattmezza',
    name: 'Matteo',
    imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
  }],
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: messageHistory,
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: '',
      colors: null,
      availableColors,
      chosenColor: null,
      alwaysScrollToBottom: false,
      messageStyling: true,
       id: null,
        message: '',
        messages: [],
        unread: false,
        chatActive: false,
        loggedIn: false,
        details: { name: "" }   
    }
  },
  mixins: [VueFocus.mixin],
  created() {
    this.setColor('blue')
  },
  methods: {
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
      }
    },
    handleTyping (text) {
      this.showTypingIndicator = text.length > 0 ? this.participants[this.participants.length - 1].id : '';
    },
    onMessageWasSent (message) {
      this.messageList = [ ...this.messageList, message ]
    },
    openChat () {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      this.isChatOpen = false
    },
    setColor (color) {
      this.colors = this.availableColors[color]
      this.chosenColor = color
    },
    showStylingInfo() {
      this.$modal.show('dialog', {
        title: 'Info',
        text: 'You can use *word* to <strong>boldify</strong>, /word/ to <em>emphasize</em>, _word_ to <u>underline</u>, `code` to <code>write = code;</code>, ~this~ to <del>delete</del> and ^sup^ or ¡sub¡ to write <sup>sup</sup> and <sub>sub</sub>'
      })
    },
    messageStylingToggled(e) {
      this.messageStyling = e.target.checked
    },
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
            style.width = '500px';
            style.height = '700px';
        },
        login: function() {
          console.log('Logged In')
          debugger;
            if (!this.details.name) return;

            socket.emit('login', Object.assign({}, this.details, { id: this.id }));
            this.loggedIn = true;
            this.isChatOpen=!this.isChatOpen
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
      debugger;
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
 
  },
  computed: {
    linkColor() {
      return this.chosenColor === 'dark' ? this.colors.sentMessage.text : this.colors.launcher.bg
    },
    backgroundColor() {
      return this.chosenColor === 'dark' ? this.colors.messageList.bg : '#fff'
    }
  },
    updated: function () {
        this.$nextTick(function() {
            if (!this.unread) return;

            let messagesBody = this.$el.querySelector('.messages-body');
            if (messagesBody) messagesBody.scrollTop = messagesBody.scrollHeight;
            this.unread = false;
        });
    }
}
</script>

<style>
/* 
body {
  padding: 0px;
  margin: 0px;
}

* {
  font-family: Avenir Next, Helvetica Neue, Helvetica,sans-serif;
}

.demo-description {
  max-width: 500px;
}

.demo-description img {
  max-width: 500px;
}

.demo-test-area {
  width: 300px;
  box-sizing: border-box;
}

.demo-test-area--text {
  box-sizing: border-box;
  width: 100%;
  margin: 0px;
  padding: 0px;
  resize: none;
  font-family: Avenir Next, Helvetica Neue, Helvetica,sans-serif;
  background: #fafbfc;
  color: #8da2b5;
  border: 1px solid #dde5ed;
  font-size: 16px;
  padding: 16px 15px 14px;
  margin: 0;
  border-radius: 6px;
  outline: none;
  height: 150px;
  margin-bottom: 10px;
}

.demo-monster-img {
  width: 400px;
  display: block;
  margin: 60px auto;
}

.text-center {
  text-align: center;
}

.colors a {
  color: #fff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 10px;
}

.toggle a {
  text-decoration: none;
}

.messageStyling {
  font-size: small;
} */

</style>