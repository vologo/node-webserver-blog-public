const state = {
    isNeedLogin: false, // login model 显示与否
    userInfo: {
        username: '',
        email: '',
        url: '',
        avatar: ''
    },
    hasUserInfo: false, // 是否有个人信息
};

const getters = {
    isNeedLogin: state => state.isNeedLogin,
    userInfo: state => state.userInfo,
    hasUserInfo: state => state.hasUserInfo,
};

const mutations = {
    setShow(state, payload) {
        state.isNeedLogin = payload;
    },
    setHide(state, payload) {
        state.isNeedLogin = payload;
    },
    updateUserInfo() {
        const {
            username,
            email,
            url,
            avatar
        } = localStorage.getItem('zhooson_blog_userinfo') ? JSON.parse(localStorage.getItem('zhooson_blog_userinfo')) : {};

        if (username && email) {
            state.hasUserInfo = true
        } else {
            state.hasUserInfo = false
        }

        state.userInfo = {
            username,
            email,
            url,
            avatar
        };
    },
    registerUserinfo(state, payload) {
        console.info('payloadpayload', payload)
        localStorage.setItem('zhooson_blog_userinfo', JSON.stringify(payload))
    }
};

const actions = {};

export default {
    state,
    actions,
    getters,
    mutations,

    namespaced: true, // 命名空间
};