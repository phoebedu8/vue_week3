import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2/',
      apiPath: 'yiijiee118',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      status: false,
    }
  },
  methods: {
    checkLogin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios.get(url).then((response) => {
        this.products = response.data.products;
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      if (!this.status) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    openModal(status, item) {
      if (status === 'create') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.status = true;
        productModal.show();
      } else if (status === 'edit') {
        this.tempProduct = { ...item };
        this.status = false;
        productModal.show();
      } else if (status === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();

    // bootstrap
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });
  },
}).mount('#app');