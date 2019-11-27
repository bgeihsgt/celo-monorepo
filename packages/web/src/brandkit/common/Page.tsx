import { SingletonRouter, withRouter } from 'next/router'
import * as React from 'react'
import { findNodeHandle, StyleSheet, View } from 'react-native'
import MobileMenu from 'src/brandkit/common/MobileMenu'
import Sidebar from 'src/brandkit/common/Sidebar'
import Topbar from 'src/brandkit/common/TopBar'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { ScreenProps, ScreenSizes, withScreenSize } from 'src/layout/ScreenSize'
import Footer from 'src/shared/Footer.3'
import menu, { hashNav } from 'src/shared/menu-items'
import { HEADER_HEIGHT } from 'src/shared/Styles'
import { colors, standardStyles } from 'src/styles'

const ROOT = menu.BRAND.link

const LOGO_PATH = `${ROOT}/logo`

const COLOR_PATH = `${ROOT}/color`

const TYPE_PATH = `${ROOT}/typography`

// const IMAGERY_PATH = `${ROOT}/key-imagery`
const ICONS_PATH = `${ROOT}/icons`

const PAGES = [
  {
    title: 'Introduction',
    href: ROOT,
    sections: [],
  },
  {
    title: 'Logo',
    href: LOGO_PATH,

    sections: [
      { title: 'Overview', href: `${LOGO_PATH}#${hashNav.brandLogo.overview}` },
      { title: 'Space and Sizing', href: `${LOGO_PATH}#${hashNav.brandLogo.space}` },
      { title: 'Backgrounds', href: `${LOGO_PATH}#${hashNav.brandLogo.backgrounds}` },
    ],
  },
  {
    title: 'Color',
    href: COLOR_PATH,

    sections: [
      { title: 'Overview', href: `${COLOR_PATH}#${hashNav.brandColor.overview}` },
      { title: 'Background Colors', href: `${COLOR_PATH}#${hashNav.brandColor.backgrounds}` },
    ],
  },
  {
    title: 'Typography',
    href: TYPE_PATH,

    sections: [
      { title: 'Overview', href: `${TYPE_PATH}#${hashNav.brandTypography.overview}` },
      { title: 'Type Scale', href: `${TYPE_PATH}#${hashNav.brandTypography.system}` },
    ],
  },
  {
    title: 'Icons',
    href: ICONS_PATH,
    sections: [],
  },
  // {
  //   title: 'Key Imagery',
  //   href: IMAGERY_PATH,

  //   sections: [
  //     { title: 'Overview', href: `${IMAGERY_PATH}#${hashNav.brandImagery.overview}` },
  //     { title: 'Illustrations', href: `${IMAGERY_PATH}#${hashNav.brandImagery.illustrations}` },
  //     { title: 'Abstract Graphics', href: `${IMAGERY_PATH}#${hashNav.brandImagery.graphics}` },
  //   ],
  // },
]

export const ROUTE_TO_TITLE = PAGES.reduce((mapping, page) => {
  mapping[page.href] = page.title
  return mapping
}, {})

interface Section {
  id: string
  children: React.ReactNode
}

interface Props {
  router: SingletonRouter
  sections: Section[]
}

interface State {
  routeHash: string
}

class Page extends React.Component<Props & ScreenProps, State> {
  state: State = {
    routeHash: '',
  }

  ratios: Record<string, { id: string; ratio: number; top: number }> = {}

  observer: IntersectionObserver

  pageRef = React.createRef<View>()

  sectionRefs = this.props.sections.reduce((acc, section) => {
    acc[section.id] = React.createRef<View>()
    return acc
  }, {})

  onChangeHash = () => {
    this.setState({ routeHash: window.location.hash })
  }

  onIntersection = (entries: IntersectionObserverEntry[]) => {
    this.ratios = entries
      .map((entry) => ({
        id: entry.target.id,
        ratio: entry.intersectionRatio,
        top: entry.boundingClientRect.top,
      }))
      .reduce((acc, currentValue) => {
        acc[currentValue.id] = currentValue
        return acc
      }, this.ratios)

    const top = Object.keys(this.ratios)
      .map((key) => this.ratios[key])
      .reduce(
        (acc, current) => {
          if (current.ratio > acc.ratio) {
            return current
          }
          return acc
        },
        { ratio: 0, id: this.state.routeHash }
      )

    if (this.state.routeHash !== top.id) {
      this.setState({ routeHash: top.id })
      window.history.replaceState({}, top.id, `${location.pathname}#${top.id}`)
    }
  }

  observation = () => {
    this.observer = new IntersectionObserver(this.onIntersection, {
      // root: findNodeHandle(this.pageRef.current) as any,
      // rootMargin: `200px`,
      threshold: [0.1, 0.5, 0.9, 1],
    })

    Object.keys(this.sectionRefs).forEach((id) => {
      const value = this.sectionRefs[id]
      // findNodeHandle is typed to return a number but returns an Element
      const element = (findNodeHandle(value.current) as unknown) as Element
      this.observer.observe(element)
    })
  }

  componentDidMount = () => {
    this.observation()

    window.addEventListener('hashchange', this.onChangeHash, false)
  }

  componentWillUnmount = () => {
    this.observer.disconnect()
    window.removeEventListener('hashchange', this.onChangeHash)
  }

  render() {
    const { screen, sections, router } = this.props
    const isMobile = screen === ScreenSizes.MOBILE
    return (
      <View style={styles.conatiner} ref={this.pageRef}>
        <View style={styles.topbar}>
          <Topbar isMobile={isMobile} />
        </View>
        <View style={{ marginTop: 70 }} />
        {isMobile && (
          <MobileMenu pages={PAGES} pathname={router.pathname} routeHash={this.state.routeHash} />
        )}
        <GridRow mobileStyle={styles.mobileMain} desktopStyle={standardStyles.sectionMarginTop}>
          <Cell span={Spans.fourth} style={styles.sidebar}>
            {!isMobile && (
              <Sidebar
                pages={PAGES}
                currentPathName={router.pathname}
                routeHash={this.state.routeHash}
              />
            )}
          </Cell>
          <Cell span={Spans.three4th} style={!isMobile && styles.desktopMain}>
            <View
              style={[styles.childrenArea, !isMobile && styles.childrenAreaDesktop]}
              ref={this.pageRef}
            >
              {sections.map(({ id, children }) => {
                return (
                  <View key={id} nativeID={id} ref={this.sectionRefs[id]}>
                    {children}
                  </View>
                )
              })}
            </View>
          </Cell>
        </GridRow>
        <View style={styles.footer}>
          <Footer />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // @ts-ignore creates a stacking context
  conatiner: { transform: 'isolate' },
  mobileMain: { zIndex: -5, marginTop: 50 },
  desktopMain: { flex: 1, flexBasis: 'calc(75% - 50px)' },
  sidebar: { minWidth: 190, paddingLeft: 0 },
  topbar: {
    position: 'fixed',
    width: '100%',
    borderBottomColor: colors.gray,
    zIndex: 10,
  },
  footer: { zIndex: -10, backgroundColor: colors.white },
  childrenArea: {
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  },
  childrenAreaDesktop: {
    // Design calls for *baseline* of text Title to match that of intro on side nav
    transform: [{ translateY: -25 }],
  },
})

export default withRouter(withScreenSize<Props>(Page))
