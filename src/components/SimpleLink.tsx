interface SimpleLinkProps {
  href: string;
  label: string;
}

const SimpleLink = ({href, label}: SimpleLinkProps) => {
  return <a href={href} rel="noreferrer"
            className={'text-blue-600 dark:text-sky-500 hover:underline'}>{label}</a>
}

export {SimpleLink}
