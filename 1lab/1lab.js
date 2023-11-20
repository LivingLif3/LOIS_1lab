/*
Лабораторная работа №1 по дисциплине ЛОИС
Выполнена студентами группы 121702 БГУИР Летко Александр, Голушко Даниил, Нагла Никита
Вариант 1: Разработать программу для выполнения прямого нечёткого логического вывода, используя импликацию Гёделя
*/
import {Parser} from "./parser.js";
import {ReadFile} from "./readfile.js";
import {ImplicationCopy} from './implicate.js'
import {GenerateAllRules} from './generateAllRules.js'
import {Deduction} from './Conclusion.js'

function conversionParcels(parcel) {
    let conversedParcel = []
    for(let cortege of parcel.corteges) {
        conversedParcel.push([cortege.name, cortege.value])
    }
    return conversedParcel
}

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


    // for(let i = 0; i < allRules.length; i++) {
    //     let firstPredicate = parser.predicate.find(el => el.name === allRules[i][0])
    //     let secondPredicate = parser.predicate.find(el => el.name === allRules[i][1])
    //     for(let j = 0; j < parser.parcel.length; j++) {
    //         let implicate = new ImplicationCopy(firstPredicate, secondPredicate, parser.parcel[j])
    //         let ans = implicate.calculate()
    //         if(ans.length !== 0) {
    //             console.log(`Rule: ${allRules[i][0]}~>${allRules[i][1]}, and parcel: ${parser.parcel[j].name}`)
    //             console.log(implicate.showAns(ans))
    //         }
    //     }
    // }

    for(let parcel of parser.predicate) {
        console.log('-------------------------------------------------')
        let deductionTool = new Deduction(parser.predicate, conversionParcels(parcel), parser.rules)
        console.log(`Start parcel: ${deductionTool.showSet(conversionParcels(parcel))}`)
        deductionTool.startDeduction()

    }

    // let implicate = new ImplicationCopy(parser.predicate[0], parser.predicate[1], parser.parcel[1])
    // console.log(implicate.calculate())
    // console.log(implicate.showAns(implicate.calculate()))
}

main()


