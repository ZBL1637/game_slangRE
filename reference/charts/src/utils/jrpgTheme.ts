import { tokens } from './colors';

export const jrpgTheme = {
  color: tokens.palette,
  backgroundColor: tokens.bg.canvas,
  textStyle: {
    fontFamily: 'sans-serif',
    color: tokens.text.main
  },
  title: {
    textStyle: {
      color: tokens.text.main,
      fontWeight: 'bold'
    },
    subtextStyle: {
      color: tokens.text.sub
    }
  },
  line: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2,
      color: tokens.line.main
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false
  },
  graph: {
    itemStyle: {
      color: tokens.palette[0],
      borderColor: 'rgba(232,240,255,0.25)',
      borderWidth: 1
    },
    lineStyle: {
      color: 'rgba(124,196,255,0.14)',
      width: 1,
      curveness: 0.2
    },
    label: {
      color: tokens.text.main
    }
  },
  sunburst: {
    label: {
      color: tokens.text.main,
      textBorderColor: 'transparent'
    },
    itemStyle: {
      borderColor: 'rgba(124,196,255,0.55)',
      borderWidth: 1.5
    }
  },
  heatmap: {
    itemStyle: {
      borderColor: tokens.bg.canvas,
      borderWidth: 1
    }
  },
  tooltip: {
    backgroundColor: 'rgba(18, 26, 46, 0.95)', // panel color with opacity
    borderColor: tokens.line.main,
    borderWidth: 1,
    textStyle: {
      color: tokens.text.main
    },
    padding: 10
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: tokens.line.axis
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: tokens.line.axis
      }
    },
    axisLabel: {
      show: true,
      color: tokens.text.sub
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: [tokens.line.grid]
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: [tokens.bg.panel]
      }
    }
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: tokens.line.axis
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: tokens.line.axis
      }
    },
    axisLabel: {
      show: true,
      color: tokens.text.sub
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: [tokens.line.grid]
      }
    },
    splitArea: {
      show: false
    }
  }
};
