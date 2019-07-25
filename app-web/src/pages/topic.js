import React, { useState } from 'react';
import { graphql, navigate } from 'gatsby';
import queryString from 'query-string';
import rehypeReact from 'rehype-react';
import { isInteger } from 'lodash';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DYNAMIC_TOPIC_PATHS, POPULAR_TOPIC_CONFIGURATION } from '../constants/ui';
import { buildPopularTopic } from '../utils/helpers';
import { flattenGatsbyGraphQL } from '../utils/dataHelpers';
import Popular from '../components/TopicEntryPage/Popular';
import ComponentPreview from '../components/ComponentPreview/ComponentPreview';
import SideDrawer from '../components/SideDrawer/SideDrawer';
import withNode from '../hoc/withNode';
import Layout from '../hoc/Layout';
import Masthead from '../components/GithubTemplate/Masthead/Masthead';
import Navigation from '../components/GithubTemplate/Navigation/Navigation';
import Actions from '../components/GithubTemplate/Actions/Actions';
import {
  MarkdownBody,
  Main,
  SidePanel,
  SideDrawerToggleButton,
} from '../components/GithubTemplate/common';

const TopicPage = ({ data, location }) => {
  const [menuToggled, setMenuToggled] = useState(false);
  // navigate is not available at build timie, this page is a dynamic one so it willr esolve to navigate when a client
  // accesses this page
  const navigateFn = global.window ? navigate : () => null;
  const query = queryString.parse(location.search);
  const nodes = flattenGatsbyGraphQL(data.allGithubRaw.edges);
  const [topic, topicType, resource] = location.pathname.replace(/^\/|\/$/, '').split('/');
  // // if ?viewResource=0 then auto navigate to the given resource with that index
  // // this is in place so that topic entry pages can provide a means to link to a given resource from within the topic
  const shouldAutoNavigate = query.viewResource && isInteger(query.viewResource / 1);
  //  removes the leading and trailing slash from the path name

  let navigationComponent = null;
  let resourceComponent = null;
  let topicMetadata = {};

  if (!DYNAMIC_TOPIC_PATHS[topicType]) {
    return navigateFn('404');
  }

  if (topicType === DYNAMIC_TOPIC_PATHS.popular) {
    const nodesForTopic = buildPopularTopic(
      nodes,
      POPULAR_TOPIC_CONFIGURATION.minPageViews,
      POPULAR_TOPIC_CONFIGURATION.maxNodes,
    );

    const navigation = nodesForTopic.map(n => ({
      path: `/${topic}/${topicType}/${n.fields.slug}`,
      position: n.fields.position,
      resourceType: n.fields.resourceType,
      name: n.fields.title,
      id: n.id,
    }));

    if (shouldAutoNavigate && nodesForTopic[query.viewResource]) {
      const { viewResource, ...remainingParams } = query;
      navigateFn(
        `/topic/${topicType}/${
          nodesForTopic[query.viewResource].fields.slug
        }?${queryString.stringify(remainingParams)}`,
      );
    }

    navigationComponent = <Navigation items={navigation} />;

    topicMetadata = {
      name: POPULAR_TOPIC_CONFIGURATION.name,
      description: POPULAR_TOPIC_CONFIGURATION.description,
    };
    // if there is not resource path, then use the popular markdown file as the 'entry page'
    if (!resource) {
      resourceComponent = <Popular />;
    } else {
      const node = nodesForTopic.find(n => n.fields.slug === resource);

      if (node) {
        // bind the github raw data to the preview node
        const previewWithNode = withNode(node)(ComponentPreview);
        const renderAst = new rehypeReact({
          createElement: React.createElement,
          components: { 'component-preview': previewWithNode },
        }).Compiler;
        const [owner, repo] = node.html_url.replace('https://github.com/').split('/');
        resourceComponent = (
          <MarkdownBody>
            {' '}
            {/* 
            if there is a tag in the markdown <component-preview> 
            the renderAst will drop in the rehype component
            otherwise if not tag exists it is biz as usual
          */}
            {renderAst(node.childMarkdownRemark.htmlAst)}
            <Actions
              repo={repo}
              owner={owner}
              pageTitle={node.fields.title}
              originalSource={node.html_url}
              devhubPath={node.fields.slug}
            />
          </MarkdownBody>
        );
      } else {
        // there is no node for the resource path, redirect to 404
        navigateFn('404');
      }
    }
  }

  return (
    <Layout>
      <Masthead title={topicMetadata.name} description={topicMetadata.description} type="Topics" />
      <Main>
        <SidePanel>{navigationComponent}</SidePanel>
        <SideDrawerToggleButton onClick={() => setMenuToggled(true)}>
          <FontAwesomeIcon icon={faBars} style={{ color: '#026' }} />{' '}
          <span>{topic.name} Content</span>
        </SideDrawerToggleButton>
        {resourceComponent}
      </Main>
      <SideDrawer
        show={menuToggled}
        title={topicMetadata.name}
        addContent={true}
        closeDrawer={() => setMenuToggled(false)}
      >
        {navigationComponent}
      </SideDrawer>
    </Layout>
  );
};

export const dynamicNodeQuery = graphql`
  query dynamicQuery {
    allGithubRaw {
      edges {
        node {
          id
          pageViews
          fields {
            resourceType
            title
            description
            image
            pagePaths
            slug
            personas
          }
          childMarkdownRemark {
            htmlAst
            html
          }
        }
      }
    }
  }
`;

export default TopicPage;