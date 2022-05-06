const {Device, DeviceInfo} = require("../models/models");
const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')

class BrandController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const device = await Device.create({name, price, brandId, typeId, info, img: fileName})

            if (info) {
                JSON.parse(info).forEach(f => {
                    DeviceInfo.create({
                        title: f.title,
                        description: f.description,
                        deviceId: device.id
                    })
                })
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page * limit - limit
        let device;
        if (!brandId && !typeId) {
            device = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            device = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            device = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (brandId && typeId) {
            device = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }

        return res.json(device)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne({where: {id}, include: [{model: DeviceInfo, as: 'info'}]})
        return res.json(device)
    }
}

module.exports = new BrandController()
















