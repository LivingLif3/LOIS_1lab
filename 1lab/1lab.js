import {Implication} from "./implicate.js";
import {Parser} from "./parser.js";
import {ReadFile} from "./readfile.js";

// Функция, запускающая все остальные функции для работы программы
const main = () => {
    //Считываем информацию с файла
    let fileData = new ReadFile('input.txt')
    let data = fileData.readFile()
    console.log(data)

    //Парсим информацию, которую считали с файла
    let parser = new Parser(data)
    parser.startParser()
    console.log(parser.predicate, parser.parcel)
}

main()


