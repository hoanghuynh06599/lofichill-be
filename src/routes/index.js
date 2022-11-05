const siteRoute = require('./site')
const authRoute = require('./auth')
const userRoute = require('./user')

const routes = (app) => {
    app.use("/", siteRoute)
    app.use("/v1/auth", authRoute)
    app.use("/v1/user", userRoute)
}

module.exports = routes
