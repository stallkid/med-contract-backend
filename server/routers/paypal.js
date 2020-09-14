const express = require('express')
const request = require('request')
const { Pharmacy } = require('./../models/pharmacy')
const router = new express.Router()
const bcrypt = require('bcryptjs');
const _ = require('lodash');

var CLIENT =
  'AZs1j7_o5MTLv9wiCqvcxNL3uhatpv8FO_lONpexrh070IPUM7z1n4KUtzcBoz2foTbX7vL0wkJpBIMI';
var SECRET =
  'EC6zrBqzJGuMWCENPKprBZJgxmsORE2UFO7APd1ISREWrXVNFQgVLhgtXvQJymCg1VVoB9SpnzNvDPu6';
var PAYPAL_API = 'https://api.sandbox.paypal.com';

router.post('/create-payment', async (req, res) => {
    try {
        request.post(PAYPAL_API + '/v1/payments/payment', {
            auth: {
                user: CLIENT,
                pass: SECRET
            },
            body: {
                intent: 'sale',
                payer: {
                    payment_method: 'paypal'
                },
                transactions: [
                    {
                        amount: {
                            total: '',
                            currency: 'BRL'
                        }
                    }
                ],
                json: true
            }, function(err, response) {
                if (err) {
                    console.error(err);
                    return res.status(500);
                }
                res.json(
                    {
                        id: response.body.id
                    }
                );
            }
        });
        res.status(201).send(pharmacy)

    } catch (e) {
        res.status(400).send(e)
    }
});

router.post('/execute-payment', async (req, res) => {
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
    var itemValue = req.body.itemValue;

    request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
      '/execute',
      {
        auth:
        {
          user: CLIENT,
          pass: SECRET
        },
        body:
        {
          payer_id: payerID,
          transactions: [
          {
            amount:
            {
              total: req.body.itemValue,
              currency: 'BRL'
            }
          }]
        },
        json: true
      },
      function(err, response)
      {
        if (err)
        {
          console.error(err);
          return res.sendStatus(500);
        }
        // 4. Return a success response to the client
        res.json(
        {
          status: 'success'
        });
    });
});

module.exports = router