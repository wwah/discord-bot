import {client} from "../index.js";

export default class {

    constructor() {

        client.user.setActivity({
            name: "wwah.chat",
            type: "WATCHING"
        })
    }
    async run(){};
}