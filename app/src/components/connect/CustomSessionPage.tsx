import React, { FormEvent, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { useStore } from 'store';
import { Collapse } from 'react-collapse';
import { Column, Row, ChevronUp, ChevronDown } from 'components/base';
import { Paragraph, Small, Label } from 'components/common/v2/Text';
import OverlayFormWrap from 'components/common/OverlayFormWrap';
import FormField from 'components/common/FormField';
import FormInput from 'components/common/FormInput';
import FormSelect from 'components/common/FormSelect';
import FormDate from 'components/common/FormDate';
import FormSwitch from 'components/common/v2/FormSwitch';
import PurpleButton from './PurpleButton';

const Styled = {
  Wrapper: styled.div`
    padding: 150px 0;
    background-color: ${props => props.theme.colors.blue};
  `,
  PermissionTypes: styled.div``,
  PermissionType: styled.div<{ active?: boolean }>`
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 4px;
    margin-top: 8px;
    transition: background-color 200ms ease-in-out;

    &:hover {
      background-color: ${props => props.theme.colors.lightBlue};
    }

    ${props => props.active && `background-color: ${props.theme.colors.lightBlue};`};
  `,
  Permissions: styled.div`
    background-color: ${props => props.theme.colors.lightningNavy};
    padding: 24px 24px 8px 24px;
    border-radius: 4px;
    margin-top: 8px;
  `,
  Permission: styled.div`
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
  `,
  FormSelect: styled(FormSelect)`
    .rc-select {
      font-family: ${props => props.theme.fonts.open.regular};
      font-size: ${props => props.theme.sizes.m};
      background-color: ${props => props.theme.colors.blue};
      padding: 12px 40px 8px 0px;
    }

    .rc-select-selection-item {
      padding-left: 0;
      margin-left: -2px;
    }
  `,
  FormInput: styled(FormInput)`
    input {
      font-family: ${props => props.theme.fonts.open.regular};
      font-size: ${props => props.theme.sizes.m};
      background-color: ${props => props.theme.colors.blue};
      padding: 12px 40px 12px 0px;
    }
  `,
  FormDate: styled(FormDate)`
    input {
      font-family: ${props => props.theme.fonts.open.regular};
      font-size: ${props => props.theme.sizes.m};
      background-color: ${props => props.theme.colors.blue};
      padding: 12px 40px 12px 0px;
      margin-top: 26px;
    }
  `,
  Small: styled(Small)`
    color: ${props => props.theme.colors.lightningGray};
  `,
  Button: styled(PurpleButton)`
    margin: 16px 16px 0 0;
  `,
  ToggleAdvanced: styled(Paragraph)`
    cursor: pointer;
  `,
  ProxyField: styled(FormField)`
    margin-top: 16px;
  `,
};

const CustomSessionPage: React.FC = () => {
  const { appView, addSessionView } = useStore();

  const handleBack = useCallback(() => {
    addSessionView.cancel();
    appView.goTo('/connect');
  }, [appView]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addSessionView.handleCustomSubmit();
  }, []);

  const setPermissionType = (permissionType: string) => {
    return () => {
      addSessionView.setPermissionType(permissionType);
    };
  };

  const togglePermission = (permission: string) => {
    return () => {
      addSessionView.togglePermission(permission);
    };
  };

  const {
    Wrapper,
    PermissionTypes,
    PermissionType,
    Permissions,
    Permission,
    FormSelect,
    FormInput,
    FormDate,
    Small,
    Button,
    ToggleAdvanced,
    ProxyField,
  } = Styled;
  return (
    <Wrapper>
      <OverlayFormWrap
        title="Custom Permissions"
        description="Choose session type or create custom sessions."
        onBackClick={handleBack}
      >
        <form onSubmit={handleSubmit}>
          <Row>
            <Column cols={4}>
              <Label semiBold>Expiration</Label>

              <FormField>
                <FormSelect
                  value={addSessionView.expiration}
                  onChange={addSessionView.setExpiration}
                  options={[
                    { label: '7 Days', value: '7' },
                    { label: '30 Days', value: '30' },
                    { label: '60 Days', value: '60' },
                    { label: '90 Days', value: '90' },
                    { label: 'Never', value: 'never' },
                    { label: 'Custom', value: 'custom' },
                  ]}
                />
              </FormField>
            </Column>

            {addSessionView.expiration === 'custom' ? (
              <Column cols={4}>
                <FormField>
                  <FormDate
                    value={addSessionView.expirationDate}
                    onChange={addSessionView.setExpirationDate}
                    placeholder="mm/dd/yyyy"
                  />
                </FormField>
              </Column>
            ) : null}
          </Row>

          <Row>
            <Column>
              <Label semiBold>Permission Type</Label>

              <PermissionTypes>
                <PermissionType
                  active={addSessionView.permissionType === 'admin'}
                  onClick={setPermissionType('admin')}
                >
                  <Paragraph bold>Admin</Paragraph>
                  <Small>User has all permissions.</Small>
                </PermissionType>

                <PermissionType
                  active={addSessionView.permissionType === 'read-only'}
                  onClick={setPermissionType('read-only')}
                >
                  <Paragraph bold>Read-Only</Paragraph>
                  <Small>User can only view node data, not take any actions.</Small>
                </PermissionType>

                <PermissionType
                  active={addSessionView.permissionType === 'liquidity'}
                  onClick={setPermissionType('liquidity')}
                >
                  <Paragraph bold>Liquidity Manager</Paragraph>
                  <Small>User can only set fees, use Loop, and use Pool.</Small>
                </PermissionType>

                <PermissionType
                  active={addSessionView.permissionType === 'payments'}
                  onClick={setPermissionType('payments')}
                >
                  <Paragraph bold>Payments Manager</Paragraph>
                  <Small>User can only send and receive payments.</Small>
                </PermissionType>

                <PermissionType
                  active={addSessionView.permissionType === 'custom'}
                  onClick={setPermissionType('custom')}
                >
                  <Paragraph bold>Custom</Paragraph>
                  <Small>Create a session with fully custom permissions.</Small>
                </PermissionType>
              </PermissionTypes>
            </Column>

            <Column>
              <Label semiBold>Permissions</Label>

              <Permissions>
                <Permission>
                  <div>
                    <Paragraph bold>View Activity</Paragraph>
                    <Small>See node history and activity.</Small>
                  </div>

                  <FormSwitch checked={true} />
                </Permission>

                <Permission>
                  <div>
                    <Paragraph bold>Open Channel</Paragraph>
                    <Small>Open a channel to another peer.</Small>
                  </div>

                  <FormSwitch
                    checked={addSessionView.permissions.openChannel}
                    onChange={togglePermission('openChannel')}
                  />
                </Permission>

                <Permission>
                  <div>
                    <Paragraph bold>Close Channel</Paragraph>
                    <Small>Close a channel to another peer.</Small>
                  </div>

                  <FormSwitch
                    checked={addSessionView.permissions.closeChannel}
                    onChange={togglePermission('closeChannel')}
                  />
                </Permission>

                <Permission>
                  <div>
                    <Paragraph bold>Set Fees</Paragraph>
                    <Small>Set fees for your channels.</Small>
                  </div>

                  <FormSwitch
                    checked={addSessionView.permissions.setFees}
                    onChange={togglePermission('setFees')}
                  />
                </Permission>

                <Permission>
                  <div>
                    <Paragraph bold>Loop</Paragraph>
                    <Small>Use Loop to manage liquidity.</Small>
                  </div>

                  <FormSwitch
                    checked={addSessionView.permissions.loop}
                    onChange={togglePermission('loop')}
                  />
                </Permission>

                <Permission>
                  <div>
                    <Paragraph bold>Pool</Paragraph>
                    <Small>Buy and sell liqudiity in Pool marketplace.</Small>
                  </div>

                  <FormSwitch
                    checked={addSessionView.permissions.pool}
                    onChange={togglePermission('pool')}
                  />
                </Permission>

                <Permission>
                  <div>
                    <Paragraph bold>Send</Paragraph>
                    <Small>Send funds from this node.</Small>
                  </div>

                  <FormSwitch
                    checked={addSessionView.permissions.send}
                    onChange={togglePermission('send')}
                  />
                </Permission>

                <Permission>
                  <div>
                    <Paragraph bold>Receive</Paragraph>
                    <Small>Receive funds on this node.</Small>
                  </div>

                  <FormSwitch
                    checked={addSessionView.permissions.receive}
                    onChange={togglePermission('receive')}
                  />
                </Permission>
              </Permissions>
            </Column>
          </Row>

          <ToggleAdvanced bold onClick={addSessionView.toggleAdvanced}>
            {addSessionView.showAdvanced ? (
              <ChevronUp size="large" />
            ) : (
              <ChevronDown size="large" />
            )}
            Advanced Options
          </ToggleAdvanced>

          <Collapse isOpened={addSessionView.showAdvanced}>
            <ProxyField>
              <Label semiBold space={8}>
                Proxy Server
              </Label>

              <FormInput
                value={addSessionView.proxy}
                onChange={addSessionView.setProxy}
                placeholder="Custom"
              />
              <Small>Specify a custom Lightning Node Connect proxy server</Small>
            </ProxyField>
          </Collapse>

          <Button>Submit</Button>
          <Button secondary type="button" onClick={handleBack}>
            Cancel
          </Button>
        </form>
      </OverlayFormWrap>
    </Wrapper>
  );
};

export default observer(CustomSessionPage);
