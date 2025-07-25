import { Localized } from '@fluent/react'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router'
import { NavLink } from 'react-router-dom'
import * as Sentry from '@sentry/react'

import { User } from '../../../stores/user'
import StateTree from '../../../stores/tree'
import URLS from '../../../urls'
import { localeConnector, LocalePropsFromState } from '../../locale-helpers'
import {
  CameraIcon,
  CloudIcon,
  CogIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
  CodeIcon,
} from '../../ui/icons'
import AvatarSetup from './avatar-setup/avatar-setup'
import DeleteProfile from './delete/delete'
import InfoPage from './info/info'
import Settings from './settings/settings'
import DownloadProfile from './download/download'
import { ApiCredentials } from './api-credentials'

import './layout.css'

const SentryRoute = Sentry.withSentryRouting(Route)

interface PropsFromState {
  user: User.State
}

interface Props extends LocalePropsFromState, PropsFromState {}

const Layout = ({ toLocaleRoute, user }: Props) => {
  const [
    infoRoute,
    avatarRoute,
    prefRoute,
    deleteRoute,
    downloadRoute,
    apiCredentialsRoute,
  ] = [
    URLS.PROFILE_INFO,
    URLS.PROFILE_AVATAR,
    URLS.PROFILE_SETTINGS,
    URLS.PROFILE_DELETE,
    URLS.PROFILE_DOWNLOAD,
    URLS.PROFILE_API_CREDENTIALS,
  ].map(r => toLocaleRoute(r))
  return (
    <div className="profile-layout">
      <div className="profile-nav">
        <div className="links">
          {[
            {
              route: infoRoute,
              ...(user.account
                ? { icon: <UserIcon />, id: 'profile' }
                : { icon: <UserPlusIcon />, id: 'build-profile' }),
            },
            { route: avatarRoute, icon: <CameraIcon />, id: 'avatar' },
            {
              route: apiCredentialsRoute,
              icon: <CodeIcon />,
              id: 'api-credentials',
            },
            { route: prefRoute, icon: <CogIcon />, id: 'settings' },
            {
              route: deleteRoute,
              icon: <TrashIcon />,
              id: 'profile-form-delete',
            },
            {
              route: downloadRoute,
              icon: <CloudIcon />,
              id: 'download-profile',
            },
          ]
            .slice(0, user.account ? Infinity : 1)
            .map(({ route, icon, id }) => (
              <NavLink key={route} to={route}>
                {icon}
                <Localized id={id}>
                  <span className="text" />
                </Localized>
              </NavLink>
            ))}
        </div>
      </div>
      <div className="content">
        <Switch>
          <SentryRoute exact path={infoRoute} component={InfoPage} />
          {[
            { route: avatarRoute, Component: AvatarSetup },
            { route: prefRoute, Component: Settings },
            { route: deleteRoute, Component: DeleteProfile },
            { route: downloadRoute, Component: DownloadProfile },
            { route: apiCredentialsRoute, Component: ApiCredentials },
          ].map(({ route, Component }) => (
            <SentryRoute
              key={route}
              exact
              path={route}
              render={() =>
                user.account ? <Component /> : <Redirect to={infoRoute} />
              }
            />
          ))}
          <SentryRoute
            render={() => <Redirect to={toLocaleRoute(URLS.PROFILE_INFO)} />}
          />
        </Switch>
      </div>
    </div>
  )
}

export default connect<PropsFromState>(({ user }: StateTree) => ({ user }))(
  localeConnector(Layout)
)
