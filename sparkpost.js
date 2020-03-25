const axios = require('axios');


module.exports = function(RED) {
    function sparkpostNode(config) {
        RED.nodes.createNode(this, config)
        let node = this;
        let api = axios.create({
            baseURL: "https://api.sparkpost.com/api/v1",
            timeout: 5000,
            headers: {Authorization: config.apiKey}
        })
        // not sure the need for the below format / node in general, starter guide showed it like this though
        // node.name = config.name
        // node.templateId = config.templateId
        // node.apiKey = config.apiKey
        // node.to = config.to

        let payload = {
            content: {
                template_id: config.templateId
            },
            substitution_data: "",
            recipients: [
                {
                    address: {
                        email: config.recipient,
                        name: config.name
                    }
                }
            ]
        }

        node.on('input', async function(msg) {
            payload.substitution_data = msg.payload;

            try {
                let transmission = await api.post('transmissions', payload)
                msg.response = transmission
                node.send(msg);
            } catch (error) {
                node.send(error)
            }
        })
    }
    RED.nodes.registerType("sparkpost", sparkpostNode)
}

