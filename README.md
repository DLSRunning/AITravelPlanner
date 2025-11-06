## AI Travel Planner

GitHub repo 地址: [DLSRunning/AITravelPlanner](https://github.com/DLSRunning/AITravelPlanner)

docker image 文件地址: crpi-x5ucku749z915ih4.cn-shanghai.personal.cr.aliyuncs.com/dls_ai_travel_planner/ai_travel_planner:latest

---

#### 如何运行

该项目为React前端项目，项目中所有涉及到的API均填入了GitHub.Settings.Secrets.Actions.Secret一起打包，直接运行Docker文件即可

**拉取镜像到本地**

```
docker pull crpi-x5ucku749z915ih4.cn-shanghai.personal.cr.aliyuncs.com/dls_ai_travel_planner/ai_travel_planner:latest
```

**运行容器**

```
docker run -d -p 80:80 crpi-x5ucku749z915ih4.cn-shanghai.personal.cr.aliyuncs.com/dls_ai_travel_planner/ai_travel_planner:latest
```

---

#### 使用说明

##### 登录与注册

界面如图，注意使用了Supabase.auth进行用户管理，因此注册时需要邮箱验证。
可直接使用的本人账户为：

2456202991@qq.com

123456

<img width="2556" height="1440" alt="屏幕截图 2025-11-06 111326" src="https://github.com/user-attachments/assets/cf1eaf34-4296-4e5c-874a-e135b293a92c" style="zoom:25%;" />

<img width="2556" height="1440" alt="屏幕截图 2025-11-06 111335" src="https://github.com/user-attachments/assets/3601ace8-330c-46ed-b231-da296e0560d0" style="zoom:25%;" />

---

##### 边栏

如图，左侧为边栏，用以切换页面与退出登录

<img width="2556" height="1440" alt="屏幕截图 2025-11-06 111358" src="https://github.com/user-attachments/assets/89fd68b4-98ac-474f-8bf2-7b58e37ad3f8" style="zoom:25%;"/>

---

##### 新建计划

如图，为新建计划页面，下方有语音识别按钮，注意语音功能依赖浏览器支持 Web Speech API

<img width="2553" height="1440" alt="屏幕截图 2025-11-06 113503" src="https://github.com/user-attachments/assets/f0f7f290-2521-443b-90b5-b55ff0c53be7" style="zoom:25%;"/>

---

##### 历史计划

实现云端行程同步

<img width="2549" height="1440" alt="屏幕截图 2025-11-06 113607" src="https://github.com/user-attachments/assets/b5d7e7e0-40df-4fcd-a039-d5064983fb68" style="zoom:25%;"/>

---

##### 详情页面

展示计划中每一天的详情，右侧的百度地图支持互动

<img width="2559" height="1439" alt="屏幕截图 2025-11-06 113645" src="https://github.com/user-attachments/assets/4e2d973d-d116-42b4-9158-522cff245a36" style="zoom:25%;"/>

<img width="2559" height="1439" alt="屏幕截图 2025-11-06 113653" src="https://github.com/user-attachments/assets/afaf1620-51a6-44f5-a5a0-d5737a12aa16" style="zoom:25%;"/>

<img width="2559" height="1439" alt="屏幕截图 2025-11-06 113701" src="https://github.com/user-attachments/assets/69c828eb-88b1-41d8-baa3-589b52ef639a" style="zoom:25%;"/>

<img width="2559" height="1439" alt="屏幕截图 2025-11-06 113719" src="https://github.com/user-attachments/assets/744f0d61-71d2-466a-8b5e-f2337e238317" style="zoom:25%;"/>


















