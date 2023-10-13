export class Implication {
    constructor(sets) {
        this.sets = sets
    }

    get calculateImplication() {
        let allImplications = []
        let matrix = []
        for (let i = 0; i < this.sets['0'].length; i++) {
            let implication = []
            let row = []
            for (let j = 0; j < this.sets['1'].length; j++) {
                let implicateAnswer = this.implicate(this.sets['0'][i], this.sets['1'][j])
                implication.push(`(${implicateAnswer.element},${implicateAnswer.value})`)
                row.push(implicateAnswer.value)
            }
            matrix.push(row)
            allImplications.push(implication)
        }

        this.matrix = matrix
        console.log(this.matrix)
        return allImplications
    }

    implicate(cortege1, cortege2) {

        let cortege1NoBrackets = cortege1.slice(1, cortege1.length - 1)
        let cortege2NoBrackets = cortege2.slice(1, cortege2.length - 1)

        let number1 = Number(cortege1NoBrackets.split(',')[1])
        let number2 = Number(cortege2NoBrackets.split(',')[1])

        // let values = new Set()
        // for(let i = 0.0; i <= number2; i = i + 0.1) {
        //     console.log(i)
        //     if(Math.min(number1, i) <= number2) {
        //         values.add(Math.min(number1, i))
        //     } else {
        //         console.log("HERE")
        //         values.add(number2)
        //     }
        // }
        // console.log(values)
        // values = Array.from(values)
        // let max = values[0]
        // console.log(max, 'DASDASD')
        // for(let i = 1; i < values.length; i++) {
        //     if(values[i] > max) {
        //         max = values[i]
        //     }
        // }
        // console.log(max)

        //let value = number1 <= number2 ?
        //let value = Math.max(Math.min(number1, ))
        let value = number1 <= number2 ? 1 : number2

        // let value = Boolean(Math.min(number1, Math.min(number1, number2)) <= number2) && Boolean(Math.min(number1, number2) <= 1)

        return {
            element: `(${cortege1NoBrackets.split(',')[0]},${cortege2NoBrackets.split(',')[0]})`,
            value
        }
    }

    get conjunction() {
        let copyOfMatrix = this.copyArray(this.matrix)
        let rowElements = this.getRowNumbers(this.sets['2'])

        console.log(rowElements)

        while (copyOfMatrix.length < rowElements.length) {
            copyOfMatrix.push(new Array(copyOfMatrix[0].length).fill(0))
        }

        for(let i = 0; i < this.matrix.length; i++) {
            for(let j = 0; j < this.matrix[i].length; j++) {
                copyOfMatrix[j][i] = Math.min(copyOfMatrix[j][i], rowElements[j])
            }
        }

        console.log(copyOfMatrix)

        this.conjunctionRes = copyOfMatrix
        this.rowElements = rowElements

        return copyOfMatrix
    }

    getRowNumbers(row) {
        let numbers = []
        for(let i = 0; i < row.length; i++) {
            console.log(row[i].slice(1, row[i].length - 1).split(',')[1])
            numbers.push(Number(row[i].slice(1, row[i].length - 1).split(',')[1]))
        }

        return numbers
    }

    copyArray(copiedArray) {
        let copy = []
        for (let i = 0; i < copiedArray.length; i++) {
            copy.push([...copiedArray[i]])
        }
        return copy
    }

    showConjunction() {
        let conjFlag = false
        let equalFlag = false

        for(let i = 0; i < this.conjunctionRes.length; i++) {
            let string = ""
            if(this.rowElements[i] === 1) {
                string += `|1.0|`
            } else if(this.rowElements[i] === 0) {
                string += `|0.0|`
            }
            else {
                string += `|${this.rowElements[i]}|`
            }
            if(Math.ceil(this.conjunctionRes.length / i) === 2 && !conjFlag) {
                string += " /~\\ |"
                conjFlag = true
            } else {
                string += "     |"
            }
            for(let j = 0; j < this.matrix[i].length; j++) {
                if(this.matrix[i][j] === 1) {
                    string += `1.0 `
                } else if(this.matrix[i][j] === 0) {
                    string += `0.0 `
                }
                else {
                    string += `${this.matrix[i][j]} `
                }
            }
            string += '|'
            if(Math.ceil(this.matrix.length / i) === 2 && !equalFlag) {
                string += " = "
                equalFlag = true
            } else {
                string += "   "
            }
            string += "|"
            for(let j = 0; j < this.conjunctionRes[i].length; j++) {
                if(this.conjunctionRes[i][j] === 1) {
                    string += `1.0 `
                } else if(this.conjunctionRes[i][j] === 0) {
                    string += `0.0 `
                }
                else {
                    string += `${this.conjunctionRes[i][j]} `
                }
            }
            string += "|"
            console.log(string)
        }
    }

}

export class ImplicationCopy {
    constructor(
        firstSet,
        secondSet,
        parcel,
    ) {
        this.firstSet = firstSet
        this.secondSet = secondSet
        this.parcel = parcel
    }

    get calculateImplication() {
        let result = []
        for(let i = 0; i < this.firstSet.corteges.length; i++) {
            let row = []
            let elements = []
            let value = 0
            for(let j = 0; j < this.secondSet.corteges.length; j++) {
                elements = [this.firstSet.corteges[i].name, this.secondSet.corteges[j].name]
                value = this.implicate(this.firstSet.corteges[i], this.secondSet.corteges[j])
                row.push([elements, value])
            }
            result.push(row)
        }
        return result
    }

    implicate(firstEl, secondEl) {
        let value = firstEl.value <= secondEl.value ? 1 : secondEl.value
        return value
    }

    getElementsExceptOne(el, elements) {
        return elements.filter(element => element !== el)
    }

    checkParcelAndResult(result) {
        let conjunctedMatrix = []
        if(result.length !== this.parcel.corteges.length) {
            return;
        }
        for(let i = 0; i < result.length; i++) {
            let row = []
            for(let j = 0; j < result[i].length; j++) {
                if(result[i][j][0].indexOf(this.parcel.corteges[i].name) !== -1) { // result[i][j] - [[x1,y1], 0.3]
                    let el = [this.getElementsExceptOne(this.parcel.corteges[i].name, result[i][j][0]), Math.min(this.parcel.corteges[i].value, result[i][j][1])]
                    row.push(el)
                }
            }
            conjunctedMatrix.push(row)
        }
        return conjunctedMatrix
    }

    getConclusion(conjuctedMatrix) {
        let conclusion = []
        for(let i = 0; i < conjuctedMatrix[0].length; i++) {
            let column = []
            for(let j = 0; j < conjuctedMatrix.length; j++) {
                column.push(conjuctedMatrix[j][i])
            }
            column.sort((a, b) => b[1] - a[1])
            conclusion.push(column[0])
        }
        return conclusion
    }

    showAns(ans) {
        let string = "{"
        for(let i = 0; i < ans.length; i++) {
            let cortege = ""
            if(ans[i][0].length !== 1) {
                cortege = `((${ans[i][0].join(',')}),${ans[i][1]})`
            } else {
                cortege = `(${ans[i][0].join(',')},${ans[i][1]})`
            }
            string += cortege
            if(i !== ans.length - 1) {
                string += ','
            }
        }
        string += "}"
        return string
    }

    calculate() {
        let conjuctedMatrix = this.checkParcelAndResult(this.calculateImplication)
        let ans = this.getConclusion(conjuctedMatrix)
        console.log(this.showAns(ans))
    }
}
