// src/Templates/shared/SmartLink.jsx
//
// One link component for the whole storefront: router <Link> for in-app routes,
// plain <a> for anchors / mailto / tel / external sites. Always passes the URL through safeHref().

import { Link } from "react-router-dom";
import { isExternalHref, isPlainAnchorHref, safeHref } from "./safeHref";

function SmartLink({ href, children, className = "", onClick, ...rest }) {
    const target = safeHref(href);

    if (isExternalHref(target)) {
        return (
            <a href={target} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick} {...rest}>
                {children}
            </a>
        );
    }
    if (isPlainAnchorHref(target)) {
        return (
            <a href={target} className={className} onClick={onClick} {...rest}>
                {children}
            </a>
        );
    }
    return (
        <Link to={target} className={className} onClick={onClick} {...rest}>
            {children}
        </Link>
    );
}

export default SmartLink;
