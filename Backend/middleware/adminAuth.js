import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.header
        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorised"
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        if (token_decode !== process.env.ADMIN_MAIL + process.env.ADMIN_PASSWORD) {
            return res.json({
                success: false,
                message: "Not Authorised"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

export default adminAuth