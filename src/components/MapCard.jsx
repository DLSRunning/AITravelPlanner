import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'


export default function MapCard() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">地图（占位）</Typography>
                <Typography variant="body2">此处保留地图控件（例如 Google Maps / Mapbox / 高德）集成区域。当前为占位图。</Typography>
                <div style={{ marginTop: 12 }}>
                    <img src="/public/placeholder-map.png" alt="map-placeholder" style={{ maxWidth: '100%' }} />
                </div>
            </CardContent>
        </Card>
    )
}