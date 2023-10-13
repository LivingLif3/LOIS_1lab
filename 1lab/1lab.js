import {Implication} from "./implicate.js";
import {Parser} from "./parser.js";
import {ReadFile} from "./readfile.js";
import {ImplicationCopy} from './implicate.js'
import {GenerateAllRules} from './generateAllRules.js'

// Функция, запускающая все остальные функции для работы программы
const main = () => {
    //Считываем информацию с файла
    let fileData = new ReadFile('input.txt')
    let data = fileData.readFile()

    //Парсим информацию, которую считали с файла
    let parser = new Parser(data)
    parser.startParser()

    let allRulesObject = new GenerateAllRules(parser.predicate.map(element => element.name))
    let allRules = allRulesObject.generate

    for(let i = 0; i < allRules.length; i++) {
        let firstPredicate = parser.predicate.find(el => el.name === allRules[i][0])
        let secondPredicate = parser.predicate.find(el => el.name === allRules[i][1])
        for(let j = 0; j < parser.parcel.length; j++) {
            let implicate = new ImplicationCopy(firstPredicate, secondPredicate, parser.parcel[j])
            console.log(`Rule: ${allRules[i][0]}~>${allRules[i][1]}, and parcel: ${parser.parcel[j].name}`)
            implicate.calculate()
        }
    }
    //
    // let implicate = new ImplicationCopy(parser.predicate[0], parser.predicate[1], parser.parcel[0])
    // implicate.calculate()
}

main()


