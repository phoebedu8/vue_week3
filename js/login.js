import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const site = 'https://vue3-course-api.hexschool.io/v2/';

const app = createApp({
    data() {
        return {
            user:{
                username:'',
                password:'',
            }
        }
    },
    methods: {
        login(){
            // 發送 API 至遠端並登入、儲存 Token
            const url = `${site}admin/signin`;
            axios.post(url,this.user)
            .then(res =>{
                //console.log(res);
                const {token,expired} = res.data;
                // 儲存 cookie token
                // expires 設置有效時間
                document.cookie=`hexToken=${token};expires=${new Date(expired)};`
                window.location='./products.html';  // 跳轉頁面
            })
            .catch(err=>{
                console.log(err);
            })
        }
    },
});
app.mount('#app');

