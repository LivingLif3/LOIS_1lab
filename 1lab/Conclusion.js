import {ImplicationCopy} from './implicate.js'

export class Deduction {
    constructor(predicates, parcel, rules) {
        this.predicates = predicates
        this.parcel = parcel
        this.rules = rules
        this.usedRules = []
        this.parcelsBase = new Set()
        this.parcelsBase.add(JSON.stringify(this.sortArray(this.parcel)))
    }

    checkDomain(firstSet, parcel) {
        for (let i = 0; i < parcel.length; i++) {
            let counter = 0
            for (let j = 0; j < firstSet.length; j++) {
                if (parcel[i][0] === firstSet[j].name) {
                    counter++
                }
            }
            if (!counter) {
                return false
            }
        }
        return true
    }

    getSetCorteges(nameOfSet) {
        return this.predicates.find(el => el.name === nameOfSet).corteges
    }

    getSet(nameOfSet) {
        return this.predicates.find(el => el.name === nameOfSet)
    }

    checkRuleInUsedRules(checkingRule) {
        for (let rule of this.usedRules) {
            if (JSON.stringify(rule) === JSON.stringify(checkingRule)) {
                return true
            }
        }
        return false
    }

    sortArray(arrayToSort) {
        arrayToSort.sort((a, b) => {
            if (a[0] < b[0]) {
                return -1;
            }
            if (a[0] > b[0]) {
                return 1;
            }
            return 0;
        });
        return arrayToSort
    }

    showSet(ans) {
        let string = "{"
        for(let i = 0; i < ans.length; i++) {
            let cortege = ""
            if(ans[i][0].length !== 1) {
                cortege = `(${ans[i][0]},${ans[i][1]})`
            } else {
                cortege = `(${ans[i][0]},${ans[i][1]})`
            }
            string += cortege
            if(i !== ans.length - 1) {
                string += ','
            }
        }
        string += "}"
        return string
    }

    showRule(firstSet, secondSet) {
        console.log(`Rule: ${firstSet} ~> ${secondSet}`)
    }

    showParcel() {
        console.log(`Parcel: ${this.showSet(this.parcel)}`)
    }

    showConjunction(implicateMatrix, conjunctedMatrix) {
        let conjFlag = false
        let equalFlag = false

        for(let i = 0; i < conjunctedMatrix.length; i++) {
            let string = ""
            if(this.parcel[i][1] === 1) {
                string += `|1.0|`
            } else if(this.parcel[i][1] === 0) {
                string += `|0.0|`
            }
            else {
                string += `|${this.parcel[i][1]}|`
            }
            if(Math.ceil(conjunctedMatrix.length / i) === 2 && !conjFlag) {
                string += " /~\\ |"
                conjFlag = true
            } else {
                string += "     |"
            }
            for(let j = 0; j < implicateMatrix[i].length; j++) {
                if(implicateMatrix[i][j][1] === 1) {
                    string += `1.0 `
                } else if(implicateMatrix[i][j][1] === 0) {
                    string += `0.0 `
                }
                else {
                    string += `${implicateMatrix[i][j][1]} `
                }
            }
            string += '|'
            if(Math.ceil(implicateMatrix.length / i) === 2 && !equalFlag) {
                string += " = "
                equalFlag = true
            } else {
                string += "   "
            }
            string += "|"
            for(let j = 0; j < conjunctedMatrix[i].length; j++) {
                if(conjunctedMatrix[i][j][1] === 1) {
                    string += `1.0 `
                } else if(conjunctedMatrix[i][j][1] === 0) {
                    string += `0.0 `
                }
                else {
                    string += `${conjunctedMatrix[i][j][1]} `
                }
            }
            string += "|"
            console.log(string)
        }
    }

    startDeduction() {
        for (let i = 0; i < this.rules.length; i++) {
            if (!this.checkRuleInUsedRules(this.rules[i])) {
                if (this.checkDomain(this.getSetCorteges(this.rules[i][0]), this.parcel)) {
                    this.showRule(this.rules[i][0], this.rules[i][1])
                    this.showParcel()
                    let implicationTool = new ImplicationCopy(this.getSet(this.rules[i][0]), this.getSet(this.rules[i][1]), {corteges: this.parcel})
                    let result = implicationTool.calculate()
                    if (result) {
                        console.log("Conjunction with matrix:")
                        this.showConjunction(implicationTool.getImplicationMatrix, implicationTool.getConjunctedMatrix)
                        this.parcel = result
                        let lengthOfParcelBaseBefore = this.parcelsBase.size
                        this.parcelsBase.add(JSON.stringify(this.sortArray(this.parcel)))
                        let lengthOfParcelBaseAfter = this.parcelsBase.size
                        if(lengthOfParcelBaseBefore === lengthOfParcelBaseAfter) {
                            return
                        }
                        i = 0
                        console.log(`Direct output: ${this.showSet(this.parcel)}`)
                        console.log(``)
                    }
                }
            }
        }
    }

}

// function onClick() {
//     let factsBlockOutput = document.getElementById("facts")
//     let factsInput = document.getElementById("factsInput")
//
//     if(factsBlockOutput.innerHTML === 'Пусто') {
//         factsBlockOutput.innerHTML = factsInput.value + `</br>`
//     } else {
//         factsBlockOutput.innerHTML += factsInput.value + `</br>`
//         console.log(factsBlockOutput.innerHTML)
//     }
// }
