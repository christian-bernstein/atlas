import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {PropsWithChildren, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import styled from "styled-components";
import {Color} from "../base/logic/style/Color";
import {AddRounded, MoreHoriz} from "@mui/icons-material";
import {SmallBadge} from "../triton/components/SmallBadge";

/**
 * IMPORTANT: DnDTestMain works only without strict mode!
 */
export function DnDTestMain(): JSX.Element {
    return (
        <DndProvider backend={HTML5Backend} children={
            <Board/>
        }/>
    );
}

//////////////////////////////////////////////////////////////////////////
//  TEST
//////////////////////////////////////////////////////////////////////////

export type CardProps = PropsWithChildren<{
    id: string,
    text: string,
    previewDescription?: string,
    statusGroupID: string,
    fields?: Array<Field>
}>

export function Card(props: CardProps): JSX.Element {
    const StyledCard = styled.div`
      display: flex;
      flex-direction: column;
      overflow: hidden;
      gap: 4px;
      line-height: 1.3;
      
      .card-title {
        width: fit-content;
        font-size: 14px;
      }
    `;

    const StyledCardLabels = styled.div`
      flex-wrap: wrap;
      display: flex;
      gap: 4px;
      margin-top: 8px;
    `;

    return (
        <StyledCard>
            <a href={"#"} className={"card-title"} role={"button"}>{props.text}</a>

            { props.previewDescription && (
                <Description text={props.previewDescription}/>
            ) }

            { props.fields && props.fields.length > 0 && (
                <StyledCardLabels children={
                    props.fields.map(field => fieldRenderers.get(field.renderer)?.(props, field))
                }/>
            ) }


        </StyledCard>
    );
}

export type ButtonProps = PropsWithChildren

export function Button(props: ButtonProps): JSX.Element {
    const StyledButton = styled.button`
      color: rgb(139, 148, 158);
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: background-color 100ms;
      width: 24px;
      height: 24px;
      padding: 0;
      display: inline-grid;
      place-content: center;
      border-radius: 6px;
      
      &:hover {
        background-color: rgb(48, 54, 61);
      }
    `;

    return (
        <StyledButton children={props.children}/>
    );
}

export type FieldRenderer = (card: CardProps, field: Field) => JSX.Element

export type Field = {
    name: string
    type: string,
    renderer: string,
    value: string
}

export enum Urgency {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT"
}

export const fieldRenderers: Map<string, FieldRenderer> = new Map<string, FieldRenderer>([
    ["urgency", (card, field) => {
        const urgency: Urgency = field.value as Urgency

        switch (urgency) {
            case Urgency.LOW:
                return (
                    <SmallBadge text={"Low"}/>
                );
            case Urgency.NORMAL:
                return (
                    <SmallBadge text={"Normal"}/>
                );
            case Urgency.HIGH:
                return (
                    <SmallBadge text={"High"} color={Color.ofHex("#d29922")}/>
                );
            case Urgency.URGENT:
                return (
                    <SmallBadge text={"Urgent"} color={Color.ofHex("#f85149")}/>
                );
        }
    }],
    ["string", (card, field) => (
        <SmallBadge text={field.value}/>
    )]
])

export const initialCards: Array<CardProps> = [
    { id: "1", statusGroupID: "selection-for-today", text: "Marcus p5.js Problem DO, 9.3 15:00", previewDescription: "This is the best preview description lul ^^" },
    { id: "2", statusGroupID: "in-progress", text: "Imke" },
    { id: "3", statusGroupID: "selection-for-today", text: "Hans" },
    { id: "4", statusGroupID: "selection-for-today", text: "Andrea" },
    { id: "5", statusGroupID: "selection-for-today", text: "Helmut" },
    {
        id: "6",
        statusGroupID: "todos",
        text: "Christian",
        fields: [
            {
                name: "date",
                type: "date",
                value: new Date().toDateString(),
                renderer: "string"
            }
        ]
    },
    {
        id: "7",
        statusGroupID: "done",
        text: "XYZ",
        fields: [
            {
                name: "urgency",
                type: "urgency",
                value: Urgency.HIGH,
                renderer: "urgency"
            },
            {
                name: "date",
                type: "date",
                value: new Date().toDateString(),
                renderer: "string"
            }
        ]
    },
    {
        id: "8",
        statusGroupID: "selection-for-today",
        text: "apache/kyuubi",
        fields: [
            {
                name: "urgency",
                type: "urgency",
                value: Urgency.URGENT,
                renderer: "urgency"
            }
        ],
        previewDescription: "Apache Kyuubi is a distributed and multi-tenant gateway to provide serverless SQL on data warehouses and lakehouses."
    },
]

export type NumberIndicatorProps = {
    value: number
}

export function NumberIndicator(props: NumberIndicatorProps): JSX.Element {
    const StyledNumberIndicator = styled.span`
      display: inline-block;
      padding: 2px 5px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
      border-radius: 20px;
      background-color: rgba(110, 118, 129, 0.4);
      color: rgb(139, 148, 158);
      margin-right: 8px;
      margin-top: 4px;
      margin-bottom: 4px;
    `;
    return (
        <StyledNumberIndicator children={props.value}/>
    );
}

export type ColorIconIndicatorProps = {
    color: string
}

export function ColorIconIndicator(props: ColorIconIndicatorProps): JSX.Element {
    const StyledColorIconIndicator = styled.span`
      background-color: ${props.color};
      width: 16px;
      height: 16px;
      border-radius: 8px;
      flex-shrink: 0;
      margin-right: 8px;
    `;

    return (
        <StyledColorIconIndicator/>
    );
}

export type HeaderProps = {
    columnConfig: ColumnConfig,
    visibleCards: number
}

export function Header(props: HeaderProps): JSX.Element {
    const StyledHeader = styled.div`
      background-color: rgb(1, 4, 9);
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: space-between;
      max-width: 350px;
      padding: 8px 16px 4px;
      display: flex;
    `;

    const StyledLeftHeader = styled.div`
      display: flex;
      flex-flow: row nowrap;
      -webkit-box-align: center;
      align-items: center;
      max-width: 90%;
      
      .column-title {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        cursor: default;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        color: rgb(201, 209, 217);
        height: 24px;
        margin-top: 4px;
        margin-bottom: 4px;
        margin-right: 8px;
      }
    `;

    const StyledRightHeader = styled.div`
      background-color: rgb(1, 4, 9);
      -webkit-box-align: center;
      align-items: center;
      display: flex;
    `;

    return (
        <StyledHeader>
            <StyledLeftHeader>
                { props.columnConfig.indicatorColor && (
                    <ColorIconIndicator color={props.columnConfig.indicatorColor.css()}/>
                )}
                <span className={"column-title"}>{props.columnConfig.title}</span>
                <NumberIndicator value={props.visibleCards ?? 0}/>
            </StyledLeftHeader>
            <StyledRightHeader>
                <Button children={
                    <MoreHoriz sx={{
                        width: "20px",
                        height: "20px"
                    }}/>
                }/>
            </StyledRightHeader>
        </StyledHeader>
    );
}

export type DescriptionProps = {
    text: string
}

export function AddItemButton(): JSX.Element {
    const StyledAddItemButton = styled.button`
      color: rgb(139, 148, 158);
      display: flex;
      // padding-top: 8px;
      // padding-bottom: 8px;
      padding: 8px 16px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      
      &:hover {
        background-color: rgb(48, 54, 61);
      }
      
      .button-text-main {
        color: rgb(139, 148, 158);
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
      }
    `;

    return (
        <StyledAddItemButton>
            <AddRounded sx={{
                marginRight: "8px",
                pointerEvents: "none",
                width: "20px",
                height: "20px"
            }}/>
            <span className={"button-text-main"}>Add item</span>
        </StyledAddItemButton>
    );
}

export function Description(props: DescriptionProps): JSX.Element {
    const StyledDescription = styled.span`
      font-size: 14px;
      width: fit-content;
      color: rgb(139, 148, 158);
    `;

    return (
        <StyledDescription children={props.text}/>
    );
}

export type ColumnConfig = {
    title: string,
    description?: string,
    indicatorColor?: Color
}

export type ColumnProps = {
    collection: CardCollection,
    config: ColumnConfig
}

/**
 * TODO: Implement
 * @constructor
 */
export function Column(props: ColumnProps): JSX.Element {
    const ColumnWrapper = styled.div`
      flex-direction: column;
      background-color: rgb(1, 4, 9);
      // -webkit-box-flex: 1;
      // flex-grow: 1;
      overflow-y: auto;
      position: relative;
      padding: 0;
      margin-top: 0;
      margin-bottom: 0;
      display: flex;
      border-radius: 6px;
      margin-right: 8px;
      width: 350px;
      min-width: 350px;
    `;

    const ColumnDescription = styled.span`
      margin-top: -4px;
      padding-bottom: 8px;
      padding-left: 16px;
      padding-right: 8px;
      font-size: 14px;
      max-width: 350px;
      color: rgb(139, 148, 158);
    `;

    const Column = styled.ul`
      flex-direction: column;
      background-color: rgb(1, 4, 9);
      -webkit-box-flex: 1;
      flex-grow: 1;
      overflow-y: auto;
      position: relative;
      padding: 4px 8px;
      margin-top: 0;
      margin-bottom: 0;
      display: flex;
    `;

    const DraggableCardContainer = styled.li`
      background-color: rgb(22, 27, 34);
      border-radius: 6px;
      color: rgb(201, 209, 217);
      list-style: none;
      margin-bottom: 8px;
      padding: 8px 12px 12px;
      border-color: rgb(33, 38, 45);
      border-width: 1px;
      border-style: solid;
      box-shadow: rgb(1, 4, 9) 0 3px 6px;
      height: unset;
      flex-shrink: 0;
        
      &:hover {
        border-color: rgb(48, 54, 61);
      }
      
      * {
        margin: 0;
        user-select: none;
      }
      
      a {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        color: rgb(201, 209, 217);
        text-decoration: none;
        
        &:hover {
          cursor: pointer;
          color: rgb(88, 166, 255);
          text-decoration: underline;
        }
      }
    `;

    return (
        <ColumnWrapper>
            <Header columnConfig={props.config} visibleCards={props.collection.cards.length}/>
            { props.config.description && (
                <ColumnDescription children={props.config.description}/>
            ) }

            <Droppable droppableId={props.collection.collectionID} children={(provided, snapshot) => (
                <Column className={"list"} {...provided.droppableProps} ref={provided.innerRef}>
                    { props.collection.cards.map((cData, index) => (
                        <Draggable key={cData.id} draggableId={cData.id} index={index} children={(provided, snapshot1, rubric) => (
                            <DraggableCardContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                <Card {...cData}/>
                            </DraggableCardContainer>
                        )}/>
                    )) }
                    { provided.placeholder }
                </Column>
            )}/>

            <AddItemButton/>
        </ColumnWrapper>
    );
}

export type CardCollection = {
    collectionID: string,
    cards: Array<CardProps>
}

export type BoardState = {
    collections: Array<CardCollection>
}

export function decodeToCardCollection(cards: Array<CardProps>): Array<CardCollection> {
    const colMap: Map<string, Array<CardProps>> = new Map<string, Array<CardProps>>();
    cards.forEach(cData => {
        if (!colMap.has(cData.statusGroupID)) {
            colMap.set(cData.statusGroupID, [cData])
        } else {
            colMap.get(cData.statusGroupID)!!.push(cData)
        }
    })
    return Array.from(colMap.entries()).map(e => ({
        collectionID: e[0],
        cards: e[1]
    } as CardCollection));
}

export function getCardCollection(collections: CardCollection[], columnID: string): CardCollection {
    return collections.find(cc => cc.collectionID === columnID)!!;
}

export function Board(): JSX.Element {
    const [state, setState] = useState<BoardState>({
        collections: decodeToCardCollection(initialCards)
    })

    const BoardRoot = styled.span`
      height: 100vh;
      padding: 0;
      
      * {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        line-height: 1.5;
      }
    `;

    const BoardView = styled.div`
      flex: 1 1 auto;
      // height: 0;
      // padding: 8px 16px;
      height: 100%;
      overflow-y: hidden;
      position: relative;
      display: flex;
    `;

    return (
        <BoardRoot children={
            <DragDropContext onDragEnd={(result, provided) => {
                if (!result.destination) return;
                if (result.source.droppableId === result.destination.droppableId) {
                    // Same column, just repositioned vertically
                    const collection = getCardCollection(state.collections, result.source.droppableId);
                    const cardsInCol = collection.cards
                    const items = Array.from(cardsInCol);
                    const [reorderedItem] = items.splice(result.source.index, 1);
                    items.splice(result.destination.index, 0, reorderedItem);
                    collection.cards = items;
                    const otherCollections = state.collections.filter(col => col.collectionID !== result.source.droppableId);
                    otherCollections.push(collection);
                    setState({
                        collections: otherCollections
                    });
                    return;
                }
                // Card was moved to a different column
                // Remove from current location
                let collection = getCardCollection(state.collections, result.source.droppableId);
                let cardsInCol = collection.cards
                let items = Array.from(cardsInCol);
                let [reorderedItem] = items.splice(result.source.index, 1);
                collection.cards = items;
                const otherCollections = state.collections.filter(col => col.collectionID !== result.source.droppableId);
                otherCollections.push(collection);
                // Add card to new location
                collection = getCardCollection(state.collections, result.destination.droppableId);
                cardsInCol = collection.cards;
                items = Array.from(cardsInCol);
                items.splice(result.destination.index, 0, reorderedItem);
                collection.cards = items;
                const otherTargetCollections = otherCollections.filter(col => col.collectionID !== result.destination!.droppableId);
                otherTargetCollections.push(collection);
                setState({
                    collections: otherTargetCollections
                });
            }}>
                <BoardView>
                    <Column collection={getCardCollection(state.collections, "todos")} config={{
                        title: "Todos",
                        indicatorColor: Color.ofHex("#238636"),
                        description: "This item hasn't been started"
                    }}/>

                    <Column collection={getCardCollection(state.collections, "selection-for-today")} config={{
                        title: "Selection for today",
                        description: "This item has been selected to be worked on today"
                    }}/>

                    <Column collection={getCardCollection(state.collections, "in-progress")} config={{
                        title: "In progress",
                        indicatorColor: Color.ofHex("#9e6a03"),
                        description: "This is actively being worked on"
                    }}/>

                    <Column collection={getCardCollection(state.collections, "done")} config={{
                        title: "Done",
                        indicatorColor: Color.ofHex("#8957e5"),
                        description: "This has been completed"
                    }}/>

                </BoardView>

            </DragDropContext>
        }/>
    );
}
