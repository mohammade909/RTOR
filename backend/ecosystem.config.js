module.exports ={
    apps:[
        {
            name:'mlm',
            script:'server.js',
            instances:1,
            watch:true,
            autorestart:true,
            max_memory_restart:'1G',
        }
    ]
}