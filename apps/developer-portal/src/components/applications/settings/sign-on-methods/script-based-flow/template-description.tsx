/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { CodeEditor, LinkButton } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Icon, List, Message, Modal, Table } from "semantic-ui-react";
import { AdaptiveAuthTemplateInterface } from "../../../../../models";

/**
 * Proptypes of `TemplateDescription` component.
 */
interface TemplateDescriptionPropsInterface {
    /**
     * The template object.
     */
    template: AdaptiveAuthTemplateInterface;
    /**
     * The boolean value used to open the modal.
     */
    open: boolean;
    /**
     * The method to be called on modal close.
     */
    onClose: () => void;
}

/**
 * The modal that contains template description.
 * 
 * @param {TemplateDescriptionPropsInterface} props React component props.
 * 
 * @returns {ReactElement} Template Description component.
 */
export const TemplateDescription: FunctionComponent<TemplateDescriptionPropsInterface> =
    (props: TemplateDescriptionPropsInterface): ReactElement => {

        const { template, open, onClose } = props;

        const [ dark, setDark ] = useState(false);

        const { t } = useTranslation();

        /**
         * Gets the browser color scheme so that the color scheme of the textarea can be decided.
         */
        useEffect(() => {
            if (window.matchMedia("(prefers-color-scheme:dark)").matches) {
                setDark(true);
            }
            const callback = (e) => {
                if (e.matches) {
                    setDark(true);
                } else {
                    setDark(false);
                }
            };
            window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", callback);

            return () => {
                window.matchMedia("(prefers-color-scheme:dark)").removeEventListener("change", callback);
            }
        }, []);

        return (
            <Modal open={ open } onClose={ onClose } dimmer="blurring" size="small">
                <Modal.Header>{ template.title }</Modal.Header>
                <Modal.Content scrolling>
                    <h2>{ template.title }</h2>
                    <p>{ template.summary }</p>

                    <h4>Prerequisites</h4>
                    <List>
                        { template.preRequisites.map((prerequisite: string, index: number) => {
                            return (
                                <List.Item key={ index }>
                                    <List.Icon name="check circle outline" color="green" />
                                    <List.Content>{ prerequisite }</List.Content>
                                </List.Item>
                            );
                        }) }
                    </List>

                    <h4>Parameters</h4>
                    <Table definition>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell />
                                <Table.HeaderCell>Description</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { Object.entries(template.parametersDescription)
                                .map(([ param, description ], index: number) => {
                                    return (
                                        <Table.Row key={ index }>
                                            <Table.Cell>{ param }</Table.Cell>
                                            <Table.Cell>{ description }</Table.Cell>
                                        </Table.Row>
                                    );
                                }) }
                        </Table.Body>
                    </Table>

                    <h4>Default Steps</h4>
                    { Object.entries(template.defaultStepsDescription)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .map(([ step, description ], index: number, steps) => {
                            return (
                                <div className="stepper" key={ index }>
                                    <div className="step-number">{ index + 1 }</div>
                                    <div className="step-text">{ description }</div>
                                    { steps.length !== (index + 1) && (<div className="step-connector">
                                        <div className="step-line"></div>
                                    </div>) }
                                </div>
                            );
                        }) }

                    <h4>Help Reference</h4>
                    <Message icon info>
                        <Icon name="help circle" />
                        <Message.Content>
                            <a target="_blank" href={ template.helpLink } rel="noreferrer">{ template.helpLink }</a>
                        </Message.Content>
                    </Message>

                    <h4>Code</h4>
                    <CodeEditor
                        lint
                        language="javascript"
                        sourceCode={ template.code }
                        options={ {
                            lineWrapping: true
                        } }
                        theme={ dark ? "dark" : "light" }
                        readOnly={ true }
                        data-testid={ `${template.title}-code-editor` }
                    />
                </Modal.Content>
                <Modal.Actions>
                    <LinkButton onClick={ onClose }>{ t("common:cancel") }</LinkButton>
                </Modal.Actions>
            </Modal>
        );
    };
