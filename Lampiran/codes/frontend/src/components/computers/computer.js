import React from 'react'
import { createUseStyles } from 'react-jss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDesktop } from '@fortawesome/free-solid-svg-icons'
import { observer } from 'mobx-react'

const useStyle = createUseStyles({
    root: ({ selected, selectable }) => ({
        display: "flex",
        alignItems: "center",

        color: selected ? "var(--light)" : "var(--dark)",
        backgroundColor: (!selected) ? null : "var(--primary)",

        borderColor: (selected ? "var(--gray)" : "var(--dark)"),
        borderStyle: "solid",
        borderWidth: 0,

        marginTop: 10,
        marginBottom: 10,

        cursor: selectable ? "pointer" : "unset",

        "&:hover": {
            backgroundColor: "var(--gray)",
        },

        "& .icon": {
            padding: "0.3rem"
        },
        "& .content": {
            flexGrow: 1,
            padding: "0.3rem 1rem",

            "& .computer-name": {
            }
        }
    }),
    orientLeft: {
        paddingLeft: 3,
        borderLeftWidth: "3px !important"
    },
    orientRight: {
        paddingRight: 3,
        borderRightWidth: "3px !important",
        flexDirection: "row-reverse",
        textAlign: "right"
    },
})

function Computer({ setting, selected = false, onClick = () => { }, selectable = false }) {

    const styles = useStyle({
        selected: selected,
        selectable: selectable
    });

    let orientClass = styles.orientLeft;
    if ((setting.d_pos || {}).orient === "r") {
        orientClass = styles.orientRight
    }

    return (
        <div className={`${styles.root} ${orientClass}`} onClick={onClick}>
            <div className="icon"><FontAwesomeIcon icon={faDesktop} /></div>
            <div className="content">
                <span className="computer-name text-monospace">{setting.name || "Computer"}</span>
            </div>
        </div>
    )
}

export default observer(Computer);
