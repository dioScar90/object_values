
class Money {
  private readonly money: number
  private readonly cents: number

  private constructor(value: number | string) {
    const [money, cents] = Money.getValueSeparated(value)

    this.money = money
    this.cents = +cents.toFixed(2)
  }

  private static getMoney(value: number) {
    return Math.floor(value)
  }

  private static getCents(value: number) {
    const cents = value % 1

    if (cents < 100) {
      return Math.max(0, cents)
    }

    const centsAsString = String(cents)
    return +(centsAsString.slice(0, 2))
  }

  private static separateNumber(value: number) {
    const money = Money.getMoney(value)
    const cents = Money.getCents(value)

    return [money, cents] as const
  }

  private static getValueSeparated(value: unknown) {
    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new Error('Invalid value')
    }

    const valueInNumber = +value

    if (isNaN(valueInNumber)) {
      throw new Error('Invalid number')
    }

    return Money.separateNumber(valueInNumber)
  }

  getConcurrency() {
    //
  }

  private getUnitedValue = () => +(String(this.money) + '.' + String(this.cents))

  applyDiscount(discountPercentage: number) {
    const moneyUnited = this.getUnitedValue()
    const discountValue = moneyUnited * discountPercentage

    const moneyWithDiscount = Money.separateNumber(this.money * discountPercentage)
    const centsWithDiscount = Money.separateNumber(this.cents * discountPercentage)

    const allMoney = moneyWithDiscount[0] + centsWithDiscount[0]
    const allCents = moneyWithDiscount[1] + centsWithDiscount[1]



    const valueWithDiscount = moneyUnited - discountValue

    return Money.create(valueWithDiscount)
  }

  sum(toSum: number) {
    const [moneyToSum, centsToSum] = Money.separateNumber(toSum)

    let newMoney = this.money + moneyToSum
    let newCents = this.cents + centsToSum

    const possibleExcedentCents = newCents - 100

    if (possibleExcedentCents > 0) {
      newCents -= 100
      newMoney += possibleExcedentCents
    }

    const value = String(newCents) + '.' + String(newMoney)
    return Money.create(value)
  }

  static create = (value: number | string) => new Money(value)
}
