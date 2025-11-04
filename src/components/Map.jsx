import React, { useEffect } from 'react';

const BaiduMap = ({item}) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//api.map.baidu.com/api?type=webgl&v=1.0&ak=您的密钥'; // 确保使用正确的 ak
        script.async = true;
        script.onload = () => {
            initMap(); // 百度地图加载完成后调用初始化函数
        };
        script.onerror = () => {
            console.error('Baidu Map API script failed to load.');
        };
        document.head.appendChild(script);

        const initMap = () => {
            // 确保BMapGL对象可用
            if (typeof BMapGL !== 'undefined') {
                const map = new BMapGL.Map('container');
                map.centerAndZoom(new BMapGL.Point(item.position.lng, item.position.lat), 18); // 设置中心点和缩放级别
                map.enableScrollWheelZoom(true); // 启用滚轮缩放

                // 创建标记
                const marker1 = new BMapGL.Marker(new BMapGL.Point(item.position.lng, item.position.lat));

                // 添加标记到地图
                map.addOverlay(marker1);
            } else {
                console.error('BMapGL is not defined. Make sure the Baidu Map API script is loaded.');
            }
        };

        // 清理脚本标签，避免重复加载
        return () => {
            document.head.removeChild(script);
        };
    }, [item]);

    return <div id="container" style={{ width: '100%', height: '100vh' }}></div>;
};

export default BaiduMap;
