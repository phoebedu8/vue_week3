import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const apiUrl = "https://vue3-course-api.hexschool.io/v2"; //站點
const path = "yiijiee118"; //API Path

const app = createApp({
    data(){
        return{
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        login(){
            axios.post(`${apiUrl}/admin/signin`,this.user)
            .then(response=>{
                // console.log(response.data)
                const { token, expired } = response.data;
                // console.log(token, expired);

                // 寫入 cookie token
                // expires 設置有效時間
                document.cookie = `hexToken=${ token }; expired=${ new Date(expired) }`;

                //跳轉到產品頁面
                window.location = 'product.html';
            })
            .catch(err=> {
                alert(err.response.data.message);
            });
        },
    },
});
app.mount('#app');