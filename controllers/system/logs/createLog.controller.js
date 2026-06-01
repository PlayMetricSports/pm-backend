const LogController = require('@/controllers/system/logs/log.controller')


const CreateLog = async (req, res) => {
    const { relation, status, message = '', content = {} } = req.body
    const result = await LogController(req, relation, status, message, content)
    return res.status(result.code).json({
        code: result.code,
        success: result.success,
        error: result.error,
        message: result.message
    })
}


module.exports = CreateLog