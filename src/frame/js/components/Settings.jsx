import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NotificationChannelItem from './NotificationChannelItem';

import { getAppChannelDetails } from '../utils/app';
import { isChannelLinked, getDisplayName } from '../utils/user';


export class SettingsComponent extends Component {

    static propTypes = {
        appChannels: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        notificationSettingsChannelsTitleText: PropTypes.string.isRequired,
        notificationSettingsChannelsDescriptionText: PropTypes.string.isRequired
    };

    render() {
        const {appChannels, user, notificationSettingsChannelsTitleText, notificationSettingsChannelsDescriptionText} = this.props;

        let channels = getAppChannelDetails(appChannels);
        channels.sort(({channel}) => {
            // List the linked channels first
            return isChannelLinked(user.clients, channel.type) ? -1 : 1;
        });

        channels = channels.map(({channel, details}) => {
            return <NotificationChannelItem key={ channel.type }
                                            id={ channel.type }
                                            {...details}
                                            displayName={ getDisplayName(user.clients, channel.type) }
                                            linked={ isChannelLinked(user.clients, channel.type) }
                                            hasURL={ !!details.getURL(channel) } />;
        });

        return <div className='settings'>
                   <div className='content-wrapper'>
                       <div className='settings-wrapper'>
                           <p className='settings-header'>
                               { notificationSettingsChannelsTitleText }
                           </p>
                           <p className='settings-description'>
                               { notificationSettingsChannelsDescriptionText }
                           </p>
                           <div className='channels'>
                               { channels }
                           </div>
                       </div>
                   </div>
               </div>;
    }
}

export default connect(({config, user, ui}) => {
    return {
        appChannels: config.integrations,
        notificationSettingsChannelsTitleText: ui.text.notificationSettingsChannelsTitle,
        notificationSettingsChannelsDescriptionText: ui.text.notificationSettingsChannelsDescription,
        user
    };
})(SettingsComponent);