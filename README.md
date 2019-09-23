## node-webserver-blog-public

三个项目中各种各样的授权参数 已全部修改成自己的授权参数，忘悉知！！！！忘悉知！！！！忘悉知！！！！

### vue-blog-web

- 代理(5454 为 node 的端口)

```
    proxyTable: {
        "/mapi": {
            target: "http://localhost:5454",
            changeOrigin: true,
            pathRewrite: {
                "^/mapi": ""
            }
        },
    }
```

- 接口层封装(http/index.js)

```
    import Axios from 'axios'
    import Router from '../router'

    export default {
        get(url, params) {
            return new Promise((resolve, reject) => {

                Axios({
                        method: "get",
                        url: url,
                        params: {
                            ...params,

                            author: 'admin'
                        },
                        validateStatus: function(status) {
                            // 截获状态码范围
                            return status >= 200 && status < 500
                        },
                    }).then(response => {
                        if (response.status == 200) {
                            resolve(response.data);
                        } else if (response.status == 401) {
                            // 无权限

                        } else if (response.status == 403) {
                            // session 过期
                            Router.push('/login')
                        } else {
                            reject(response.data)
                        }
                    })
                    .catch(error => {

                        reject(error);
                    })
            })
        },
        post(url, method = 'post', params) {
            return new Promise((resolve, reject) => {

                Axios({
                        method,
                        url: url,
                        data: {
                            ...params,

                            author: 'admin'
                        },
                        validateStatus: function(status) {
                            return status >= 200 && status < 500
                        },
                    }).then(response => {
                        if (response.status == 200) {
                            resolve(response.data);
                        } else if (response.status == 401) {
                            // Message.error('登录信息过期，请重新登录');
                            // Router.replace('/login')
                            resolve({});
                        } else if (response.status == 403) {
                            Router.push('/login')
                        } else {
                            reject(response.data)
                        }
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },
        fetch(url, params, headers = {}) {
            return new Promise((resolve, reject) => {
                Axios({
                        method: "post",
                        url: url,
                        data: params,
                        headers: {
                            "Content-Type": "application/json",
                            ...headers
                        }
                    }).then(response => {
                        if (response.status == 200) {
                            resolve(response.data);
                        } else {
                            reject(response.data)
                        }
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },
    }
```

- markdown 的语法编译成 html

```
    <mavon-editor ref="editor" :value="content" :subfield="false"
      :defaultOpen="'preview'" :toolbarsFlag="false" :editable="false"
      :scrollStyle="true" :ishljs="true">
    </mavon-editor>
```

- 生成 H2，H3 的文章目录
  具体查看（vue-blog-web/views/article/detail.vue）

- 其他都是 vue 的基础的知识，省略。。。

### vue-blog-admin

- 项目基础配置详见(vue-cli3-admin)[https://github.com/liuxingzhijian1320/vue-cli3-admin]

* 代理(vue.config.js)

```
    proxy: {
        "/mapi": {
            target: "http://localhost:5454",
            changeOrigin: true,
            pathRewrite: {
                "^/mapi": ""
            }
        },
    },
```

- 全局变量

1. .env.development
2. .env.production

- 多级路由实现(首页 /文章管理 /文章评论)  
  多级路的原因，因为现在很多的增加和删除都是弹窗的实现，但是一旦内容很多的时候的，新页面的就是最佳的方法

实现的主要方法： meta 的 `hidden` 的属性  
具体查看（vue-blog-admin/src/router/routes.js）

### vue-blog-koa

- 使用 koa-generator 生成 koa2 项目

  https://blog.csdn.net/Zhooson/article/details/83716814

- 运行的项目一定先修改 config/db.js 的文件，不然会报错的，项目运行自动生成数据库，自己在数据库 User 表创建的一个用户，然后登录 admin 的操作

```
    const Sequelize = require('sequelize');
    /**
    *
    * 配置数据库
    *
    * 第一个参数 myblog3   数据库名字 (自己修改)
    * 第二个参数 root      数据库名字 (自己修改)
    * 第三个参数 password  数据库密码 (自己修改)
    */
    const sequelize = new Sequelize('myblog3', 'root', '你的数据库密码', {
        host: 'localhost',
        dialect: 'mysql',
        operatorsAliases: false,
        dialectOptions: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
            supportBigNumbers: true,
            bigNumberStrings: true
        },

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        timezone: '+08:00' //东八时区
    });

    module.exports = {
        sequelize
    }
```

- jwt 权限校验

```
    // 签发token
    const token = jwt.sign(userToken, JWT_SECRET, { expiresIn: '10h' });
```

- 接口白名单

1. myblog3-app-5454.js

```
// jwt
app.use(
    koajwt({ secret: JWT_SECRET }).unless({
        path: [
            // 登录
            /^\/api\/user\/login/,
            ...
        ],
    })
);
```

2. middleware/JWTPath.js

```
  module.exports = [
    // 登录
    '/api/user/login',
    ...
];
```

- 发送邮件 （controllers/SendEmailServer.js）[发送邮件文章参考](https://blog.csdn.net/Zhooson/article/details/79889081)

```
    const nodemailer = require("nodemailer");

    // code...

    // Use Smtp Protocol to send Email
    var transporter = nodemailer.createTransport({
        //node_modules/nodemailer/well-known/services.json 支持列表
        host: 'smtp.qq.com',
        port: 465, // SMTP 端口
        secure: true,
        auth: {
            user: NODEMAILER.email,
            //这里密码不是qq密码，是你设置的smtp密码（授权码）
            pass: NODEMAILER.pass
        }
    });
```

- node 调用第三方接口

```
    const koaRequest = require('koa-http-request');

    app.use(koaRequest({
        json: true, //automatically parsing of JSON response
        timeout: 3000, //3s timeout
        // host: 'https://api.github.com'
    }));
```

- github 授权 流程（controllers/GithubToken.js）

  1. 注册 OAuth APP 的应用
  2. 保存 client_id client_secret
  3. 访问 GET: https://github.com/login/oauth/authorize?client_id=c4cde05e7ea&scope=user
  4. 跳转 http://localhost:3000/auth?code=8b309cc03f95 保存 code 字段
  5. https://github.com/login/oauth/access_token POST 请求 body:{client_id,client_secret,code} 获取 token
  6. https://api.github.com/user POST 请求： body:{client_id,client_secret} header: {Authorization: token token}

- 上传图片（controllers/UploadServer.js）

  koa-body 实现上传图片，递归创建目录等

- sequelize 数据库实现 （controllers/schema.js）
  以 user.js 为例子

```
  const moment = require('moment');
  module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 用户名字
        username: {
            type: DataTypes.STRING(100),
            field: 'username',
            allowNull: false
        },
        // 用户密码
        password: {
            type: DataTypes.STRING(255),
            field: 'password',
            allowNull: false
        },
        // 用户邮箱
        email: {
            type: DataTypes.STRING(100),
            field: 'email',
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })
}
```

- sequelize 的使用方法：

  以 Article 为模型例子

1. 创建

```
    Article.create(params)
```

2. 编辑

```
    Article.update({ browser }, {
        where: {
            id
        },
        fields: ['browser']
    })
```

3. 查看详情

```
    Article.findOne({
        where: id,
    });
```

4. 删除

```
  Article.destroy({
      where: {
          id,
      }
  })
```

5. 分页列表

```
  Article.findAndCountAll({
      row: true,
      limit: +pageSize,
      offset: (pageIndex - 1) * (+pageSize),
      order: [
          ['id', 'DESC']
      ],
  });
```

6. 模糊搜索

```
  const Op = Sequelize.Op;

  Article.findAndCountAll({
      row: true,
      limit: +pageSize,
      offset: (pageIndex - 1) * (+pageSize),
      where:{
        title: {
            // 模糊查询
            [Op.like]: '%' + keyword + '%',
        },
      }
      order: [
          ['id', 'DESC']
      ],
  });

```

补充 Op 的知识

```
    [Op.and]: {a: 5} // 且 (a = 5)
    [Op.or]: [{a: 5}, {a: 6}] // (a = 5 或 a = 6)
    [Op.gt]: 6, // id > 6
    [Op.gte]: 6, // id >= 6
    [Op.lt]: 10, // id < 10
    [Op.lte]: 10, // id <= 10
    [Op.ne]: 20, // id != 20
    [Op.eq]: 3, // = 3
    [Op.not]: true, // 不是 TRUE
    [Op.between]: [6, 10], // 在 6 和 10 之间
    [Op.notBetween]: [11, 15], // 不在 11 和 15 之间
    [Op.in]: [1, 2], // 在 [1, 2] 之中
    [Op.notIn]: [1, 2], // 不在 [1, 2] 之中
    [Op.like]: '%hat', // 包含 '%hat'
    [Op.notLike]: '%hat' // 不包含 '%hat'
    [Op.iLike]: '%hat' // 包含 '%hat' (不区分大小写) (仅限 PG)
    [Op.notILike]: '%hat' // 不包含 '%hat' (仅限 PG)
    [Op.regexp]: '^[h|a|t]' // 匹配正则表达式/~ '^[h|a|t]' (仅限 MySQL/PG)
    [Op.notRegexp]: '^[h|a|t]' // 不匹配正则表达式/!~ '^[h|a|t]' (仅限 MySQL/PG)
    [Op.iRegexp]: '^[h|a|t]' // ~_ '^[h|a|t]' (仅限 PG)
    [Op.notIRegexp]: '^[h|a|t]' // !~_ '^[h|a|t]' (仅限 PG)
    [Op.like]: { [Op.any]: ['cat', 'hat']} // 包含任何数组['cat', 'hat'] - 同样适用于 iLike 和 notLike
    [Op.overlap]: [1, 2] // && [1, 2](PG数组重叠运算符)
    [Op.contains]: [1, 2] // @> [1, 2](PG数组包含运算符)
    [Op.contained]: [1, 2] // <@ [1, 2](PG数组包含于运算符)
    [Op.any]: [2,3] // 任何数组[2, 3]::INTEGER (仅限 PG)
    [Op.col]: 'user.organization_id' // = 'user'.'organization_id', 使用数据库语言特定的列标识符, 本例使用 PG
```

7.  多对多的关系

```
  Category.belongsToMany(Article, {
      through: {
          model: ArticleToCategory,
      },
      foreignKey: 'categoryId',
  })
  Article.belongsToMany(Category, {
      through: {
          model: ArticleToCategory,
      },
      foreignKey: 'articleId',
  })
```

### 发布

1. 我的服务器环境 是 CentOS 7.5 64 位
2. web 和 admin 打包发布 dist 的文件， koa 全部文件发布，别发布 nodel_modules 啊， 自己的服务器安装 node，nginx，pm2 ， Mysql 等操作
3. 针对的 koa 项目发布需要注意点，因为线上每次上传图片写在 public/images 这个文件可千万不能覆盖，为了避免这个问题，自己搭建一个文件服务项目，专门管理文件资源

- 安装其他环境 用 `yum` 的命令安装
- 安装 Mysql https://blog.csdn.net/Zhooson/article/details/84314451
- nginx 配置 https://blog.csdn.net/Zhooson/article/details/84901573
- 其他环境自行安装，贼简单的啊哈

* myblog3-web-2222.js / myblog3-admin-1111.js (2 个文件就是端口号不一样)
  执行 `pm2 start myblog3-web-2222.js` 把 web 的项目启动
  执行 `pm2 start myblog3-admin-1111.js` 把 admin 的项目启动
  执行 `pm2 start myblog3-app-5454.js` 把 node 的项目启动

* 文件夹结构；
  以 web 为例子（需要先下载 express）

|--web
|---- dist (vue 打包的文件)
|---- myblog3-web-2222.js （ 文件如下代码所示）
|---- package.json （npm i express）
|---- node_moudles

```
    //引入express中间件
    var express = require('express');
    var app = express();

    //指定启动服务器到哪个文件夹，我这边指的是dist文件夹
    app.use(express.static('./dist'));

    // 监听端口为1111
    var server = app.listen(2222, function() {
        console.info('复制打开浏览器');
    });
```

### nginx 配置

- 登录服务器(2 种登录方式)

  1. Filezilla 软件登录
  2. ssh 登录

  ```
    ssh -p 22 root@你的服务器ip地址
    回车
    输入密码
  ```

- 已 ssh 登录为例子： 查找 nginx.conf 的位置

```
    whereis nginx.conf
```

查找结果：

```
    /usr/local/nginx/conf

```

熟悉 vim 的操作的，直接操作，不熟悉的使用的 FileZilla 的软件去修改

- nginx.conf(以 web 为例子)
  具体详见 ngixn.conf

```
    #博客 - 后台管理
    upstream myblog3Admin {
    	server 127.0.0.1:1111;
    }

    server {
        listen       80;
        server_name  www.zhooson.cn;
        #charset koi8-r;

        #access_log  logs/host.access.lsog  main;

        location / {

          #设置主机头和客户端真实地址，以便服务器获取客户端真实IP
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          #禁用缓存
          proxy_buffering off;

          #反向代理的地址
          proxy_pass http://myblog3Web;

          root /webproject/myblog3/web;
          index index.html index.htm;
          try_files $uri $uri/ /index.html;

        }

        location /api {
          proxy_pass http://myblog3Koa2;
        }


        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

```

- 在 web 和 admin 项目的时候访问 node 接口如何代理，关键代码如下

```
     location /api {
          proxy_pass http://myblog3Koa2;
     }
```

- 在 web 和 admin 用 mode：history 的配置

```
    root /webproject/myblog3/web;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
```
