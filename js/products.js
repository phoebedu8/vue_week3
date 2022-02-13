import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const site = 'https://vue3-course-api.hexschool.io/v2/';
const api_path = 'xqrass-hexschool';

let productModal = {};
let delProductModal = {};

const app = createApp({
    data() {
        return {
            products:[],
            temp:{
                imagesUrl: [],
            },
            isNew: false,
        }
    },
    methods: {
        checkLogin(){
            // cookie 裡面取得 token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
            // 下次發送 axios 時，會自動把 token 夾帶到 headers 裡面
            axios.defaults.headers.common.Authorization = token;
            //console.log(token);

            const url = `${site}api/user/check`;
            axios.post(url)
            .then(res =>{
                // 登入成功後，會執行取得產品資料請求
                this.getProduct();
            })
            .catch(err=>{
                alert(err.data.message);  // 跳出警示
                window.location = './login.html';  // 跳回登入頁面
            })
        },
        getProduct(){
            // 取得產品資料
            const url = `${site}api/${api_path}/admin/products/all`;
            axios.get(url)
            .then(res =>{
                //console.log(res);
                this.products=res.data.products;
            })
            .catch(err=>{
                console.log(err);
            })
        },
        openModal(status, product){
            //console.log(status, product);
            if(status === 'isNew') {
                this.temp = {  // 清空物件
                    imagesUrl: [],
                };
                productModal.show();
                this.isNew = true;  // 改變 status 狀態，true 狀態為新增
            }else if(status === 'edit'){
                this.temp = {...product};
                productModal.show();
                this.isNew = false;  // false 狀態為編輯
            }else if(status === 'delete'){
                delProductModal.show();
                this.temp = {...product};
            }
        },
        updateProduct(){ //新增產品 編輯產品
            let url = `${site}api/${api_path}/admin/product`;
            let methods = 'post';
            // 判斷要串接 post 或是 put API
            // 如果 this.isNew 是 false 狀態，則為編輯狀態
            if(!this.isNew) {
                url = `${site}api/${api_path}/admin/product/${this.temp.id}`;
                methods = 'put';
            }
            // axios[method] = axios.method 物件取值
            axios[methods](url, {data: this.temp})
            .then(res =>{
                //console.log(res);
                this.getProduct();  // 再取得一次資料
                productModal.hide();  // Modal 隱藏
            });
        },
        delProduct(){
            let url = `${site}api/${api_path}/admin/product/${this.temp.id}`;

            axios.delete(url)
            .then(res =>{
                console.log(res);
                this.getProduct();  // 再取得一次資料
                delProductModal.hide();
            });
        }
    },
    mounted() {
        // 確認是否為登入狀態
        this.checkLogin();

        // 新增 & 編輯共用
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        // 刪除使用
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    },
});
app.mount('#app');

