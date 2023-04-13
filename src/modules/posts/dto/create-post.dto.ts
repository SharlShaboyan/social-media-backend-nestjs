import { IsNotEmpty } from "class-validator"

export default class {
    @IsNotEmpty({
        message : "Նկարագրությունը չի կարող լինել դատարկ"
    })
    public readonly description : string
}