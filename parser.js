export class Parser {

    constructor(data) {
        this.data = data
        this.predicate = []
        this.parcel = []
    }

    splitByLinesExpression() {
        this.data = this.data.split('\r\n')
        return this.data
    }

    deleteSpaces() {
        this.data = this.data.map((item) => {
            return item.replace(/ /g, '')
        })
    }

    findExpressions() {
        let type = 'predicate'
        let quantity = 0
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === '' && quantity === 0) {
                type = 'parcel'
                quantity++
                continue
            }
            switch (type) {
                case 'predicate':
                    this.predicate.push(this.data[i])
                    break
                case 'parcel':
                    this.parcel.push(this.data[i])
                    break
            }
        }
    }

    eraseWhetherExpression() {
        this.data = this.data.filter((item) => {
            if (item) return item
        })
        return this.data
    }

    parsePredicates() {
        this.predicate = this.predicate.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),')
            el[1][0] += ')'
            return {name: el[0], set: el[1]}
        })
        return this.predicate
    }

    parseParcels() {
        this.parcel = this.parcel.map((el) => {
            el = el.split('=')
            el[1] = el[1].replace(/[}{]/g, '').split('),')
            el[1][0] += ')'
            return {name: el[0], set: el[1]}
        })
        return this.parcel
    }

}

/*

// Функция для считывания данных с файла
const readFile = () => {
    return fs.readFileSync('input.txt', 'utf-8')
}

// Функция нахождения количества знаков равно
const findEqualsSigns = (data) => {
    return (data.match(/=/g) || []).length
}

// Функция проверки количества знаков равно
const checkEqualsSigns = (data) => {
    return (findEqualsSigns(data) === 3)
        ? console.log('Количество знаков равно совпадает')
        : process.exit(-1)
}

// Функция нахождения имён множеств
const findNamesSets = (data) => {
    return (data.match(/([A-Z]\d*=)/g) || []).length
}

//Функция проверки количества имён множеств
const checkNamesSets = (data) => {      //Можно добавить считывание имён множеств
    return (findNamesSets(data) === 3)
        ? console.log('Количество множеств совпадает')
        : process.exit(-1)
}

// Функция, выделяющая элементы массива
const findSets = (data) => {
    return data.replace(/([A-Z]\d*=)/g, ' ').split(' ').splice(1,)
}

//Проверяет соответствие алфавиту нечёткого множества
const checkAlphabetCorrespondence = (set) => {
    return (/^[A-Za-z0-9)(}{,.]+$/.test(set))
        ? console.log(`Множество ${set} не содержит недопустимых символов`)
        : process.exit(-1)
}

// Проверяет соответствие алфавиту всех множеств
const checkAllSetsAlphabetCorrespondence = (sets) => {
    for (let i = 0; i < sets.length; i++) {
        checkAlphabetCorrespondence(sets[i])
    }
}

// Функция проверки множества на правильный ввод фигурных скобок
const checkBraces = (set) => {
    return (set[0] === '{' && set[set.length - 1] === '}')
        ? console.log(`Множество ${set} введено правильно`)
        : process.exit(-1)
}

// Функция проверки всех начальных множеств на правильный ввод фигурных скобок
const checkAllSetsBraces = (sets) => {
    for (let i = 0; i < sets.length; i++) {
        checkBraces(sets[i])
    }
}

// Функция удаления фигурных скобок в множестве
const deleteBraces = (set) => {
    set = set.split('')
    set.splice(0,1)
    set.splice(set.length - 1, 1)
    return set.join('')
}

// Функция удаления фигурных скобок во всех множествах
const deleteAllSetsBraces = (sets) => {
    let resultSets = []
    for (let i = 0; i < sets.length; i++) {
        resultSets.push(deleteBraces(sets[i]))
    }
    return resultSets
}

// Функция, которая проверяет, действительно ли в множестве содержатся кортежи,
// без проверки контента внутри
const isRightSet = (set) => {
    return (/^\(.*\)(,\(.*\))*$/g.test(set))
        ? console.log(`The ${set} is right`)
        : process.exit(-1)
}

// Функция, проверяющая действительность всех кортежей во всех множествах
const isRightAllSets = (sets) => {
    for (let i = 0; i < sets.length; i++) {
        isRightSet(sets[i])
    }
}

// Функция нахождения элементов множества
const findElements = (set) => {
    let openBrace = 0 //Переменная, отвечающая за количество открытых фигурных скобок
    let openBracket = 0 //Переменная, отвечающая за количество открытых круглых скобок
    let startIndex = 0 // Переменная, отвечающая за стартовый индекс при выделении элементов
    let elements = []
    for (let i = 0; i < set.length; i++) {
        if (set[i] === '(')
            openBracket++
        else if (set[i] === '{')
            openBrace++
        else if (set[i] === ')') {
            if (i === set.length - 1) {
                elements.push(set.slice(startIndex, i + 1))
            }
            openBracket--
        } else if (set[i] === '}')
            openBrace--
        else {
            if (set[i] === ',' && openBrace === 0 && openBracket === 0) {
                elements.push(set.slice(startIndex, i))
                startIndex = i + 1
            }
        }
    }
    return elements
}

// Функция нахождения элементов множеств
const findAllSetsElements = (sets) => {
    // Объект, содержащий два нечётких предиката А и В и нечёткую посылку С
    // Ключ - имя элемента, значение - мера возможности
    let resultSets = {}
    for (let i = 0; i < sets.length; i++) {
        resultSets[i] = findElements(sets[i])
    }
    return resultSets
}


*/
