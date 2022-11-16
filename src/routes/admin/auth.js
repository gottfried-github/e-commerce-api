import bodyParser from 'body-parser'
import {Router} from 'express'

import {log, logger} from '../../logger.js'
import * as m from '../../../../fi-common/messages.js'

import {ensureCredentials, handleInvalidPassword} from './auth-helpers.js'

function auth(auth) {
    const router = Router()

    function authenticate(req, res, next, {authenticate}) {
        authenticate(req, res, next).then(_res => {
            req.log('authMiddleware, authenticate resolved, _res:', _res)
    
            if (true !== _res) {
                if ('code' in _res) {
                    if (m.InvalidCriterion.code === _res.code) {
                        return res.status(400).json(_res)
                    } else if (m.ResourceNotFound.code === _res.code) {
                        return res.status(404).json(_res)
                    }
                } else {
                    return next(_res)
                }
            }

            return res.json({message: "successfully logged in"})
        }).catch(e => {
            req.log('authMiddleware, authenticate rejected, e:', e)
            next(e)
        })
    }
    
    function signup(req, res, next, {signup}) {
        signup(req, res, next).then(_res => {
            req.log('signupMiddleware, signup resolved, _res:', _res)
    
            if (true !== _res) return next(_res)
    
            return res.status(201).json({})
        }).catch(e => {
            req.log('signupMiddleware, signup rejected, e:', e)
    
            next(e)
        })
    }
    
    router.post('/login', bodyParser.urlencoded(), ensureCredentials, (req, res, next) => {authenticate(req, res, next, {authenticate: auth.authenticate})})
    router.post('/signup', bodyParser.urlencoded(), ensureCredentials, (req, res, next) => {signup(req, res, next, {signup: auth.signup})})
    
    router.get('/is-authenticated', (req, res) => {
        req.log('/api/admin/auth/is-authenticated, req.user:', req.user)
        res.json(!!req.user)
    })

    return {router, authenticate, signup}
}

export default auth