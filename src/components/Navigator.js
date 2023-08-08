import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import './Navigator.scss';

class MenuGroup extends Component {

    render() {
        const { name, children } = this.props;
        return (
            <li className="menu-group">
                <div className="menu-group-name">
                    <FormattedMessage id={name} />
                </div>
                <ul className="menu-list list-unstyled">
                    {children}
                </ul>
            </li>
        );
    }
}

class Menu extends Component {

    render() {
        const { name, active, link, children, onClick, hasSubMenu, onLinkClick } = this.props;
        return (
            <li className={"menu" + (hasSubMenu ? " has-sub-menu" : " ") + ("") + (active ? " active" : "")}>
                {hasSubMenu ? (
                    <Fragment>
                        <span
                            data-toggle="collapse"
                            className={"menu-link collapsed"}
                            onClick={onClick}
                            aria-expanded={"false"}
                        >
                            <FormattedMessage id={name} />
                        </span>
                        <div>
                            <ul className="sub-menu-list list-unstyled">
                                {children}
                            </ul>
                        </div>
                    </Fragment>
                ) 
                : 
                (
                        <Link to={link} className="menu-group menu-link" onClick={onLinkClick}>
                             <span
                            style={{textDecoration: 'none'}}
                            data-toggle="collapse"
                            className={"menu-group-name"}
                            onClick={onClick}
                            aria-expanded={"false"}
                            >
                            <FormattedMessage id={name} />
                        </span>
                        </Link>
                    )
                }
            </li>
        );
    }
}

class SubMenu extends Component {

    getItemClass = path => {
        return this.props.location.pathname === path ? "active" : "";
    };

    render() {
        const { name, link, onLinkClick } = this.props;
        return (
            <li className={"sub-menu " + this.getItemClass(link)}>
                <Link to={link} className="sub-menu-link" onClick={onLinkClick}>
                    <FormattedMessage id={name} />
                </Link>
            </li>
        );
    }
}

const MenuGroupWithRouter = withRouter(MenuGroup);
const MenuWithRouter = withRouter(Menu);
const SubMenuWithRouter = withRouter(SubMenu);

const withRouterInnerRef = (WrappedComponent) => {

    class InnerComponentWithRef extends React.Component {
        render() {
            const { forwardRef, ...rest } = this.props;
            return <WrappedComponent {...rest} ref={forwardRef} />;
        }
    }

    const ComponentWithRef = withRouter(InnerComponentWithRef, { withRef: true });

    return React.forwardRef((props, ref) => {
        return <ComponentWithRef {...props} forwardRef={ref} />;
    });
};

class Navigator extends Component {
    state = {
        expandedMenu: {}
    };

    toggle = (groupIndex, menuIndex) => {
        const expandedMenu = {};
        const needExpand = !(this.state.expandedMenu[groupIndex + '_' + menuIndex] === true);
        if (needExpand) {
            expandedMenu[groupIndex + '_' + menuIndex] = true;
        }

        this.setState({
            expandedMenu: expandedMenu
        });
    };

    isMenuHasSubMenuActive = (location, subMenus, link) => {
        if (subMenus) {
            if (subMenus.length === 0) {
                return false;
            }

            const currentPath = location.pathname;
            for (let i = 0; i < subMenus.length; i++) {
                const subMenu = subMenus[i];
                if (subMenu.link === currentPath) {
                    return true;
                }
            }
        }

        if (link) {
            return this.props.location.pathname === link;
        }

        return false;
    };

    checkActiveMenu = () => {
        const { menus, location } = this.props;
        outerLoop:
        for (let i = 0; i < menus.length; i++) {
            const group = menus[i];
            if (group.menus && group.menus.length > 0) {
                for (let j = 0; j < group.menus.length; j++) {
                    const menu = group.menus[j];
                    if (menu.subMenus && menu.subMenus.length > 0) {
                        if (this.isMenuHasSubMenuActive(location, menu.subMenus, null)) {
                            const key = i + '_' + j;
                            this.setState({
                                expandedMenu: {
                                    [key]: true
                                }
                            });
                            break outerLoop;
                        }
                    }
                }
            }
        }
    };

    componentDidMount() {
        this.checkActiveMenu();
    };

    componentDidUpdate(prevProps, prevState) {
        const { location } = this.props;
        const { location: prevLocation } = prevProps;
        if (location !== prevLocation) {
            this.checkActiveMenu();
        };
    };

render() {
    const { menus, location, onLinkClick } = this.props;
    return (
      <Fragment>
        <ul className="navigator-menu list-unstyled">
          {menus.map((group, groupIndex) => (
            <Fragment key={groupIndex}>
              {group.menus ? (
                group.menus.length === 1 ? ( // Kiểm tra xem có 1 subMenu hay nhiều subMenu
                  // Hiển thị subMenu thay thế cho menu
                  <MenuWithRouter
                    key={groupIndex}
                    active={this.isMenuHasSubMenuActive(location, group.menus[0].subMenus, group.menus[0].link)}
                    name={group.menus[0].name}
                    link={group.menus[0].link}
                    hasSubMenu={group.menus[0].subMenus}
                    isOpen={this.state.expandedMenu[groupIndex + '_0'] === true}
                    onClick={() => this.toggle(groupIndex, 0)}
                    onLinkClick={onLinkClick}
                  >
                    {group.menus[0].subMenus && group.menus[0].subMenus.map((subMenu, subMenuIndex) => (
                      <SubMenuWithRouter
                        key={subMenuIndex}
                        name={subMenu.name}
                        link={subMenu.link}
                        onClick={this.closeOtherExpand}
                        onLinkClick={onLinkClick}
                      />
                    ))}
                  </MenuWithRouter>
                ) : (
                  // Hiển thị menu với nhiều subMenu
                  <MenuGroupWithRouter name={group.name}>
                    {group.menus.map((menu, menuIndex) => (
                      <MenuWithRouter
                        key={menuIndex}
                        active={this.isMenuHasSubMenuActive(location, menu.subMenus, menu.link)}
                        name={menu.name}
                        link={menu.link}
                        hasSubMenu={menu.subMenus}
                        isOpen={this.state.expandedMenu[groupIndex + '_' + menuIndex] === true}
                        onClick={() => this.toggle(groupIndex, menuIndex)}
                        onLinkClick={onLinkClick}
                      >
                        {menu.subMenus && menu.subMenus.map((subMenu, subMenuIndex) => (
                          <SubMenuWithRouter
                            key={subMenuIndex}
                            name={subMenu.name}
                            link={subMenu.link}
                            onClick={this.closeOtherExpand}
                            onLinkClick={onLinkClick}
                          />
                        ))}
                      </MenuWithRouter>
                    ))}
                  </MenuGroupWithRouter>
                )
              ) : null}
            </Fragment>
          ))}
        </ul>
      </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default withRouterInnerRef(connect(mapStateToProps, mapDispatchToProps)(Navigator));
