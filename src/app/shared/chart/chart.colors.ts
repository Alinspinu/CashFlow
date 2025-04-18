

export function darkColors() {
  const colors: colors = {
    green: 'rgb(98, 234, 86)',
    greenContrast: 'rgb(139, 255, 128)',
    lightGreen: 'rgb(50, 143, 0)',
    greenRGBA: 'rgba(76, 190, 66, 0.23)',

    sand: 'rgba(168, 129, 23, 0.956)',
    lightSand: 'rgba(204, 172, 85, 0.956)',
    sandContrast: 'rgba(250, 217, 127, 0.956)',

    orange: 'rgb(117, 95, 23)',
    lightOrage: 'rgb(155, 117, 75)',
    orangeContrast: 'rgb(245, 168, 73)',

    blue: 'rgb(76, 193, 232)',
    lightBlue: 'rgb(90, 151, 171)',
    blueContrast: 'rgb(35, 190, 241)',
    blueRGBA: 'rgba(62, 165, 199, 0.28)',

    turqoise: 'rgb(29, 168, 147)',
    lightTurqoise: 'rgb(85, 180, 165)',
    turqoiseContrast: 'rgb(51, 221, 195)',

    red: 'rgb(192, 108, 102)',
    lightRed: 'rgba(201, 162, 159, 0.843)',
    redContrast: 'rgb(252, 146, 138)',

    grey: '#c0c0c0',
    lightGrey: '#d9d9d9',

    light: '#00000',
    medium: '#fff',
  }

  return colors
}

export function lightColors() {
  const colors: colors = {
    green: 'rgb(131, 255, 119)',
    greenContrast: 'rgb(11, 121, 1)',
    lightGreen: 'rgb(207, 255, 181)',
    greenRGBA: 'rgba(88, 218, 76, 0.19)',

    sand: 'rgba(250, 217, 127, 0.956)',
    lightSand: 'rgba(255, 243, 208, 0.956)',
    sandContrast: 'rgba(170, 129, 18, 0.956)',
    orange: 'rgb(175, 117, 46)',
    lightOrage: 'rgb(255, 215, 173)',
    orangeContrast: 'rgb(122, 66, 6)',

    blue: 'rgb(73, 209, 255)',
    lightBlue: 'rgb(185, 237, 255)',
    blueContrast: 'rgb(0, 97, 130)',
    blueRGBA: 'rgba(52, 182, 225, 0.15)',

    turqoise: 'rgb(51, 221, 195)',
    lightTurqoise: 'rgb(191, 255, 245)',
    turqoiseContrast: 'rgb(0, 116, 99)',
    red: 'rgb(252, 146, 138)',
    lightRed: 'rgb(255, 220, 218)',
    redContrast: 'rgb(138, 84, 80)',
    grey: '#7d7d7d',
    lightGrey: '#e8e8e8',

    light: '#fff',
    medium: '#00000',
  }
  return colors
}


export interface colors {
  green: string,
  greenContrast: string,
  lightGreen: string,
  sand: string,
  lightSand: string,
  sandContrast:string,
  orange: string,
  lightOrage: string,
  orangeContrast: string,
  blue: string,
  lightBlue: string,
  blueContrast: string,
  turqoise: string,
  lightTurqoise: string,
  turqoiseContrast: string,
  red: string,
  lightRed: string,
  redContrast: string,
  grey: string,
  lightGrey: string,
  light: string,
  medium: string,

  blueRGBA: string,
  greenRGBA: string,
}

export interface gamaTreshold {
    value: number,
    color: string
}


export function lightGama () {
    const gama: gamaTreshold[] = [
    { value: 0, color: 'rgb(89, 147, 219)' },
    { value: 5, color: 'rgb(89, 208, 219)'  },
    { value: 10, color: 'rgb(89, 219, 182)' },
    { value: 20, color: 'rgb(89, 219, 143)' },
    { value: 30, color: 'rgb(117, 219, 89)'},
    { value: 40, color: 'rgb(152, 219, 89)' },
    { value: 50, color: 'rgb(189, 219, 89)' },
    { value: 70, color: 'rgb(219, 219, 89)' },
    { value: 100, color: 'rgb(219, 200, 89)' },
    { value: 120, color: 'rgb(219, 182, 89)' },
    { value: 160, color: 'rgb(219, 160, 89)' },
    { value: 200, color: 'rgb(219, 147, 89)' },
    { value: 300, color: 'rgb(219, 121, 89)' },
    { value: 400, color: 'rgb(219, 102, 89)' },
    { value: 600, color: 'rgb(219, 89, 89)' }
  ]
  return gama
}

export function darkGama(){
  const gama: gamaTreshold[] = [
    { value: 0, color: 'rgb(74, 123, 183)' },
    { value: 5, color: 'rgb(82, 185, 194)'  },
    { value: 10, color: 'rgb(79, 197, 164)' },
    { value: 20, color: 'rgb(76, 188, 123)' },
    { value: 30, color: 'rgb(99, 183, 76)'},
    { value: 40, color: 'rgb(133, 191, 78)' },
    { value: 50, color: 'rgb(149, 171, 74)' },
    { value: 70, color: 'rgb(193, 193, 76)' },
    { value: 100, color: 'rgb(189, 172, 77)' },
    { value: 120, color: 'rgb(196, 163, 80)' },
    { value: 160, color: 'rgb(192, 141, 78)' },
    { value: 200, color: 'rgb(183, 125, 77)' },
    { value: 300, color: 'rgb(198, 110, 81)' },
    { value: 400, color: 'rgb(196, 91, 79)' },
    { value: 600, color: 'rgb(192, 80, 80)' }
  ]
  return gama
}



