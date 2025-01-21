

export function darkColors() {
  const colors: colors = {
    green: 'rgb(28, 148, 17)',
    greenContrast: 'rgb(139, 255, 128)',
    lightGreen: 'rgb(50, 143, 0)',

    sand: 'rgba(168, 129, 23, 0.956)',
    lightSand: 'rgba(204, 172, 85, 0.956)',
    sandContrast: 'rgba(250, 217, 127, 0.956)',

    orange: 'rgb(145, 86, 22)',
    lightOrage: 'rgb(155, 117, 75)',
    orangeContrast: 'rgb(245, 168, 73)',

    blue: 'rgb(0, 97, 130)',
    lightBlue: 'rgb(90, 151, 171)',
    blueContrast: 'rgb(35, 190, 241)',

    turqoise: 'rgb(29, 168, 147)',
    lightTurqoise: 'rgb(85, 180, 165)',
    turqoiseContrast: 'rgb(51, 221, 195)',

    red: 'rgb(192, 108, 102)',
    lightRed: 'rgba(201, 162, 159, 0.843',
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
    green: 'rgb(41, 181, 28)',
    greenContrast: 'rgb(11, 121, 1)',
    lightGreen: 'rgb(207, 255, 181)',
    sand: 'rgba(250, 217, 127, 0.956)',
    lightSand: 'rgba(255, 243, 208, 0.956)',
    sandContrast: 'rgba(170, 129, 18, 0.956)',
    orange: 'rgb(245, 168, 73)',
    lightOrage: 'rgb(255, 215, 173)',
    orangeContrast: 'rgb(122, 66, 6)',
    blue: 'rgb(35, 190, 241)',
    lightBlue: 'rgb(185, 237, 255)',
    blueContrast: 'rgb(0, 97, 130)',
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
  medium: string
}

export interface gamaTreshold {
    value: number,
    color: string
}


export function lightGama () {
    const gama: gamaTreshold[] = [
    { value: 0, color: 'rgb(89, 147, 219)' },
    { value: 500, color: 'rgb(89, 208, 219)'  },
    { value: 600, color: 'rgb(89, 219, 182)' },
    { value: 700, color: 'rgb(89, 219, 143)' },
    { value: 800, color: 'rgb(117, 219, 89)'},
    { value: 900, color: 'rgb(152, 219, 89)' },
    { value: 1100, color: 'rgb(189, 219, 89)' },
    { value: 1400, color: 'rgb(219, 219, 89)' },
    { value: 1700, color: 'rgb(219, 200, 89)' },
    { value: 2100, color: 'rgb(219, 182, 89)' },
    { value: 2400, color: 'rgb(219, 160, 89)' },
    { value: 2700, color: 'rgb(219, 147, 89)' },
    { value: 3000, color: 'rgb(219, 121, 89)' },
    { value: 3300, color: 'rgb(219, 102, 89)' },
    { value: 3500, color: 'rgb(219, 89, 89)' }
  ]
  return gama
}

export function darkGama(){
  const gama: gamaTreshold[] = [
    { value: 0, color: 'rgb(74, 123, 183)' },
    { value: 500, color: 'rgb(82, 185, 194)'  },
    { value: 600, color: 'rgb(79, 197, 164)' },
    { value: 700, color: 'rgb(76, 188, 123)' },
    { value: 800, color: 'rgb(99, 183, 76)'},
    { value: 900, color: 'rgb(133, 191, 78)' },
    { value: 1100, color: 'rgb(149, 171, 74)' },
    { value: 1400, color: 'rgb(193, 193, 76)' },
    { value: 1700, color: 'rgb(189, 172, 77)' },
    { value: 2100, color: 'rgb(196, 163, 80)' },
    { value: 2400, color: 'rgb(192, 141, 78)' },
    { value: 2700, color: 'rgb(183, 125, 77)' },
    { value: 3000, color: 'rgb(198, 110, 81)' },
    { value: 3300, color: 'rgb(196, 91, 79)' },
    { value: 3500, color: 'rgb(192, 80, 80)' }
  ]
  return gama
}



